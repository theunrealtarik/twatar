import type { Like, Twat, User } from "@prisma/client";

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

/**
 * Calculates self interactions for a user.
 */
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

export function calculateXp(amount: number, user: User) {
  const nextLevel = 1_000 + user.level * 100;
  const previousLevel = 1_000 + (user.level - 1) * 100;

  let xp = user.xp + amount;
  let level = user.level;

  if (xp >= nextLevel && amount > 0) {
    xp = xp - nextLevel;
    level += 1;
  }

  if (xp <= 0 && amount < 0 && user.level > 0) {
    xp = previousLevel + amount;
    level -= 1;
  }

  return { xp, level };
}

export enum Folders {
  ProfilePictures = "profiles_pictures",
  Twats = "twats",
}
