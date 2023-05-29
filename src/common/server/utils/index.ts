import type { Like, Twat } from "@prisma/client";

export const TWAT_INCLUDES = {
  embeddedTwat: {
    include: {
      author: true,
    },
  },
  retwats: true,
  author: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  likes: {
    select: {
      userId: true,
    },
  },
  _count: {
    select: {
      likes: true,
      retwats: true,
    },
  },
};

export function selfInteractions(
  sessionUserId: string,
  {
    likes,
    retwats,
  }: {
    likes: Pick<Like, "userId">[];
    retwats: Twat[];
  }
) {
  const selfLike = !!likes.find((like) => like.userId === sessionUserId);
  const selfRetwat = !!retwats.find(
    (retwat) => retwat.authorId === sessionUserId
  );

  return { selfLike, selfRetwat };
}
