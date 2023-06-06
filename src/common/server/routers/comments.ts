import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../api/trpc";
import type { Comment } from "@prisma/client";

export default createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tid: z.string(),
        content: z.string().min(1).max(200),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const createdComment = await ctx.prisma.comment.create({
        data: {
          userId,
          twatId: input.tid,
          content: input.content,
        },
      });

      return createdComment;
    }),
  all: publicProcedure
    .input(
      z.object({
        tid: z.string(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input: { tid, cursor } }) => {
      const limit = 10;
      const comments = await ctx.prisma.comment.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        take: limit + 1,
        where: {
          twatId: tid,
        },
        include: {
          user: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
        },
      });

      let nextCursor: string | undefined;
      if (comments.length > limit) {
        const lastComment = comments.pop() as Comment;
        nextCursor = lastComment.id;
      }

      return {
        comments,
        nextCursor,
      };
    }),
});
