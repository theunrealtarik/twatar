import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../api/trpc";

import user from "./user";
import posts from "./posts";
import tenor from "./tenor";
import { POST_INCLUDES, selfInteractions } from "../utils";

export const appRouter = createTRPCRouter({
  user,
  posts,
  tenor,
  profile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: input.userId,
        },
        include: {
          followers: true,
          following: true,
          posts: true,
        },
      });

      return user;
    }),

  feed: publicProcedure
    .input(
      z.object({
        limit: z.number().default(15),
        cursor: z.string().nullish(),
        filters: z
          .object({
            profileId: z.string().nullish(),
            followingOnly: z.boolean().nullish(),
          })
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, filters } = input;
      const userId = ctx.session?.user.id;
      let posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        // where: {
        //   authorId: filters?.profileId ?? undefined,
        // },
        include: POST_INCLUDES,
      });

      if (!!filters?.profileId) {
        posts = posts.filter(({ authorId }) => authorId === filters.profileId);
      }

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop() as (typeof posts)[number];
        nextCursor = nextItem.id;
      }

      return {
        posts: posts.map(({ authorId, likes, reposts, ...data }) => {
          const { selfLike, selfRepost } = selfInteractions(userId ?? "", {
            likes,
            reposts,
          });

          return {
            authorId,
            likes,
            reposts,
            selfLike,
            selfRepost,
            ...data,
          };
        }),
        nextCursor,
      };
    }),
});

export type AppRouter = typeof appRouter;
