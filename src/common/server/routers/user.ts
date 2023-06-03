import { TypeOf, z } from "zod";
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

  /**
   * Updates user's profile
   */
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().max(25).nullish(),
        bio: z.string().max(100).nullish(),
        image: z
          .object({
            base64: z.string(),
            fileName: z.string(),
          })
          .nullish(),
        banner: z
          .object({
            base64: z.string(),
            fileName: z.string(),
          })
          .nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      let data = {
        name: input.name,
        bio: input.bio,
      } as any;

      const handleImage = async (
        image: typeof input.image,
        folder: "avatars" | "banners"
      ) => {
        if (!!image) {
          try {
            // clean up
            const userImages = await ctx.image.listFiles({
              tags: [userId],
            });
            if (userImages.length >= 1) {
              await ctx.image.bulkDeleteFiles(
                userImages.map((image) => image.fileId)
              );
            }
            // upload
            const response = await ctx.image.upload({
              file: image.base64,
              fileName: image.fileName,
              tags: [userId],
              folder,
            });
            return response.url;
          } catch (error) {
            return undefined;
          }
        }
      };

      const [image, banner] = await Promise.all([
        handleImage(input.image, "avatars"),
        handleImage(input.banner, "banners"),
      ]);

      if (image) data.image = image;
      if (banner) data.banner = banner;

      return await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data,
      });
    }),
});
