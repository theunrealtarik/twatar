import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../api/trpc";
import { calculateXp } from "../utils";

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

      if (input.targetId !== userId && ctx.user && target) {
        const { xp, level } = calculateXp(
          input.action === "follow" ? 50 : -50,
          target
        );

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
          ctx.prisma.user.update({
            where: {
              id: target.id,
            },
            data: {
              xp,
              level,
            },
          }),
        ]);
      }
    }),
});
