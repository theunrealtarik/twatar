import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./api/trpc";

import user from "./routers/user";
import twats from "./routers/twats";
import tenor from "./routers/tenor";

import { TWAT_INCLUDES, selfInteractions } from "./utils";

export const appRouter = createTRPCRouter({
  user,
  twats,
  tenor,

  users: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        name: z.string().nullish(),
        limit: z.number().default(15),
      })
    )
    .query(async ({ ctx, input: { cursor, limit, name } }) => {
      let users = await ctx.prisma.user.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (users.length > limit) {
        const nextItem = users.pop() as (typeof users)[number];
        nextCursor = nextItem.id;
      }

      if (Boolean(name)) {
        users = users.filter(
          (user) =>
            user.name
              ?.toLocaleLowerCase()
              ?.startsWith(name?.toLowerCase() ?? "") ||
            user.name?.toLowerCase()?.includes(name?.toLowerCase() ?? "")
        );
      }

      console.log(users);

      return {
        users,
        nextCursor,
      };
    }),

  /**
   * Retrieves user profile information.
   * @returns {Promise<IUser>} - The user profile object.
   */
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
          twats: true,
        },
      });

      return user;
    }),

  /**
   * Retrieves a feed of twats.
   * @returns {Promise<object>} - The feed object containing twats and the next cursor for pagination.
   */
  feed: publicProcedure
    .input(
      z.object({
        limit: z.number().default(15),
        cursor: z.string().nullish(),
        filters: z
          .object({
            profileId: z.string().nullish(),
            followingOnly: z.boolean().nullish(),
            contains: z.string().nullish(),
          })
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, filters } = input;
      const userId = ctx.session?.user.id;
      let twats = await ctx.prisma.twat.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          authorId: filters?.profileId ?? undefined,
        },
        include: TWAT_INCLUDES,
      });

      // if (!!filters?.profileId) {
      //   twats = twats.filter(({ authorId }) => authorId === filters.profileId);
      // }

      let nextCursor: typeof cursor | undefined = undefined;
      if (twats.length > limit) {
        const nextItem = twats.pop() as (typeof twats)[number];
        nextCursor = nextItem.id;
      }

      if (!!filters?.contains) {
        twats = twats.filter(
          ({ content }) =>
            content.startsWith(filters.contains ?? "") ||
            content.includes(filters.contains ?? "")
        );
      }

      return {
        twats: twats.map(({ authorId, likes, retwats, ...data }) => {
          const { selfLike, selfRetwat } = selfInteractions(userId ?? "", {
            likes,
            retwats,
          });

          return {
            authorId,
            likes,
            retwats,
            selfLike,
            selfRetwat,
            ...data,
          };
        }),
        nextCursor,
      };
    }),
});

export type AppRouter = typeof appRouter;
