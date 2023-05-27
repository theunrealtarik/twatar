import type { Like, Post } from "@prisma/client";

export const POST_INCLUDES = {
  embeddedPost: {
    include: {
      author: true,
    },
  },
  reposts: true,
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
      reposts: true,
    },
  },
};

export function selfInteractions(
  sessionUserId: string,
  {
    likes,
    reposts,
  }: {
    likes: Pick<Like, "userId">[];
    reposts: Post[];
  }
) {
  const selfLike = !!likes.find((like) => like.userId === sessionUserId);
  const selfRepost = !!reposts.find(
    (repost) => repost.authorId === sessionUserId
  );

  return { selfLike, selfRepost };
}
