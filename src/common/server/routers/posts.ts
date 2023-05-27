import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../api/trpc";
import { POST_INCLUDES, selfInteractions } from "@/common/server/utils";

export default createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        tid: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.post.findUnique({
        where: {
          id: input.tid,
        },
        include: POST_INCLUDES,
      });

      if (data) {
        const { selfLike, selfRepost } = selfInteractions(
          ctx.session.user.id ?? "",
          {
            likes: data?.likes,
            reposts: data.reposts,
          }
        );

        return { ...data, selfLike, selfRepost };
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
      const data = await ctx.prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
          embeddedGif: input.gifUrl,
        },
        include: POST_INCLUDES,
      });
      return { ...data, selfLike: false, selfRepost: false };
    }),

  repost: protectedProcedure
    .input(
      z.object({
        tid: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.tid,
        },
        include: {
          reposts: true,
        },
      });

      const userAlreadyReposted = post?.reposts.find(
        (post) => post.authorId === userId
      );
      if (userAlreadyReposted) return;

      if (post) {
        return await ctx.prisma.post.create({
          data: {
            content: input.content,
            author: {
              connect: {
                id: userId as string,
              },
            },
            embeddedPost: {
              connect: {
                id: post.id,
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
      const userId_postId = {
        userId: ctx.session.user.id,
        postId: input.tid,
      };

      const like = await ctx.prisma.like.findUnique({
        where: {
          userId_postId,
        },
      });

      if (like) {
        await ctx.prisma.like.delete({
          where: {
            userId_postId,
          },
        });
        return -1;
      } else {
        await ctx.prisma.like.create({
          data: {
            ...userId_postId,
          },
        });
        return 1;
      }
    }),
});
