import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../api/trpc";

export default createTRPCRouter({
  /**
   * Follows or unfollows a user.
   * @returns {Promise<void>} - A promise that resolves once the operation is completed.
   */

  following: protectedProcedure
    .input(
      z.object({
        targetId: z.string(),
        action: z.enum(["follow", "unfollow"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const target = await ctx.prisma.user.findUnique({
        where: {
          id: input.targetId,
        },
      });

      if (input.targetId !== userId && ctx.user) {
        await ctx.prisma.$transaction([
          ctx.prisma.user.update({
            where: { id: userId },
            data: {
              following: {
                [input.action === "follow" ? "connect" : "disconnect"]: {
                  id: target?.id,
                },
              },
            },
          }),
        ]);
      }
    }),
});
