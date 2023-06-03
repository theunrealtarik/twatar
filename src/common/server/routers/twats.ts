import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../api/trpc";
import {
  Folders,
  TWAT_INCLUDES,
  calculateXp,
  selfInteractions,
} from "@/common/server/utils";
import { TRPCError } from "@trpc/server";

import type { UploadResponse } from "imagekit/dist/libs/interfaces";

export default createTRPCRouter({
  /**
   * Retrieves a twat by its ID.
   * @returns {Promise<object|null>} - A promise that resolves to the twat object if found, or `null` if not found.
   */
  get: protectedProcedure
    .input(
      z.object({
        tid: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.twat.findUnique({
        where: {
          id: input.tid,
        },
        include: TWAT_INCLUDES,
      });

      if (data) {
        const { selfLike, selfRetwat } = selfInteractions(
          ctx.session.user.id ?? "",
          {
            likes: data?.likes,
            retwats: data.retwats,
          }
        );

        return { ...data, selfLike, selfRetwat };
      }

      return null;
    }),
  /**
   * @description Creates a new Twat with the provided content and optional attachment. The `input` object should contain the `content` property representing the text content of the twat. An optional `attachment` object can be included, specifying the `name`, `url`, and `type` properties for the attachment. The `type` should be either "image" or "gif".
   *
   * If the attachment is an image with a valid file extension (e.g., ".png" or ".jpg") and has a URL provided, it will be uploaded. The URL of the uploaded image will replace the original attachment URL.
   *
   * The promise resolves to the created twat object on successful creation. If an error occurs during the twat creation process, a `TRPCError` is thrown with the corresponding error message and code.
   * Requires user authentication to create a twat on behalf of the authenticated user.
   */
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        attachment: z
          .object({
            name: z.string(),
            url: z.string().optional(),
            type: z.enum(["image", "gif"]),
          })
          .nullish(),
      })
    )
    .mutation(async ({ ctx, input: { content, attachment } }) => {
      if (content.length === 0) return;
      try {
        if (
          attachment &&
          attachment.type === "image" &&
          (attachment.name.endsWith(".png") ||
            attachment.name.endsWith(".jpg")) &&
          attachment.url
        ) {
          const buffer = Buffer.from(attachment.url, "base64");
          if (buffer.length > 3 * 10 ** 6)
            throw new TRPCError({
              code: "BAD_REQUEST",
              cause: "File Size",
              message: "attachments cannot be more than 3MB in size",
            });

          const uploadedImage: UploadResponse = await ctx.image.upload({
            file: attachment.url,
            fileName: attachment.name,
            folder: Folders.Twats,
          });

          attachment.url = uploadedImage.url;
        }

        const extractedHashtags = content
          .split(" ")
          .filter((word) => word.startsWith("#") || /#\w+/g.test(word));

        const data = await ctx.prisma.twat.create({
          data: {
            authorId: ctx.session.user.id,
            content,
            attachment: attachment?.url,
            hashtags: {
              connectOrCreate: extractedHashtags
                .filter((hashtag) => hashtag.length >= 2)
                .map((hashtag) => ({
                  where: {
                    name: hashtag,
                  },
                  create: {
                    name: hashtag,
                  },
                })),
            },
          },
          include: TWAT_INCLUDES,
        });

        return { ...data, selfLike: false, selfRetwat: false };
      } catch {
        throw new TRPCError({
          message: "Something Went Wrong",
          code: "BAD_REQUEST",
        });
      }
    }),

  retwat: protectedProcedure
    .input(
      z.object({
        tid: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const twat = await ctx.prisma.twat.findUnique({
        where: {
          id: input.tid,
        },
        include: {
          retwats: true,
          author: true,
        },
      });

      const userAlreadyRetwated = twat?.retwats.find(
        (retwat) => retwat.authorId === userId
      );

      if (userAlreadyRetwated) return;
      if (twat) {
        const { xp, level } = calculateXp(50, twat.author);

        await ctx.prisma.user.update({
          where: {
            id: twat.authorId,
          },
          data: {
            xp,
            level,
          },
        });

        return await ctx.prisma.twat.create({
          data: {
            content: input.content,
            author: {
              connect: {
                id: userId as string,
              },
            },
            embeddedTwat: {
              connect: {
                id: twat.id,
              },
            },
          },
        });
      }
    }),
  like: protectedProcedure
    .input(
      z.object({
        tid: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId_twatId = {
        userId: ctx.session.user.id,
        twatId: input.tid,
      };

      const [like, twat] = await ctx.prisma.$transaction([
        ctx.prisma.like.findUnique({
          where: {
            userId_twatId,
          },
        }),
        ctx.prisma.twat.findUnique({
          where: {
            id: input.tid,
          },
          include: {
            author: true,
          },
        }),
      ]);

      if (like && twat) {
        const { xp, level } = calculateXp(-10, twat.author);
        await ctx.prisma.$transaction([
          ctx.prisma.like.delete({
            where: {
              userId_twatId,
            },
          }),
          ctx.prisma.user.update({
            where: {
              id: twat?.authorId,
            },
            data: {
              xp,
              level,
            },
          }),
        ]);
        return -1;
      } else if (twat) {
        const { xp, level } = calculateXp(10, twat.author);
        await ctx.prisma.$transaction([
          ctx.prisma.like.create({
            data: {
              ...userId_twatId,
            },
          }),
          ctx.prisma.user.update({
            where: {
              id: twat?.authorId,
            },
            data: {
              xp,
              level,
            },
          }),
        ]);
        return 1;
      }
    }),
  /**
   * Deletes a twat
   */
  delete: protectedProcedure
    .input(
      z.object({
        tid: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { tid } }) => {
      try {
        const userId = ctx.session.user.id;
        const twat = await ctx.prisma.twat.findUniqueOrThrow({
          where: {
            id: tid,
          },
        });

        if (twat.authorId === userId) {
          await ctx.prisma.twat.delete({
            where: {
              id: twat.id,
            },
          });
        }
      } catch {
        throw new TRPCError({
          message: "Failed To Fetch Twats",
          code: "NOT_FOUND",
        });
      }
    }),
});
