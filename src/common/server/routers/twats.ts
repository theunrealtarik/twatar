import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../api/trpc";
import { TWAT_INCLUDES, selfInteractions } from "@/common/server/utils";

export default createTRPCRouter({
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
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        gifUrl: z.string().url().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.content.length === 0) return;
      const data = await ctx.prisma.twat.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
          embeddedGif: input.gifUrl,
        },
        include: TWAT_INCLUDES,
      });
      return { ...data, selfLike: false, selfRetwat: false };
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
        },
      });

      const userAlreadyRetwated = twat?.retwats.find(
        (retwat) => retwat.authorId === userId
      );
      if (userAlreadyRetwated) return;

      if (twat) {
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

      const like = await ctx.prisma.like.findUnique({
        where: {
          userId_twatId,
        },
      });

      if (like) {
        await ctx.prisma.like.delete({
          where: {
            userId_twatId,
          },
        });
        return -1;
      } else {
        await ctx.prisma.like.create({
          data: {
            ...userId_twatId,
          },
        });
        return 1;
      }
    }),
});
