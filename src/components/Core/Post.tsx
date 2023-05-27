import { RouterOutputs, api } from "@/common/server/api";
import { FC, useCallback, useState } from "react";

import UserAvatar from "../Display/UserAvatar";
import Button from "../UI/Button";
import Input from "../UI/Input";
import IconButton from "../UI/IconButton";

import Link from "next/link";

import { FiRepeat } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { classNames, relativeFormatTime } from "@/common/lib/utils";
import Image from "next/image";

interface PostProps {
  data: RouterOutputs["feed"]["posts"][number];
}

const Post: FC<PostProps> = ({ data }) => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const context = api.useContext();
  const onSuccess = async () => {
    await updatePostCache(context, data.id);
  };

  const repost = api.posts.repost.useMutation({ onSuccess });
  const like = api.posts.like.useMutation({ onSuccess });

  const repostHandler = useCallback(() => {
    repost.mutate({ tid: data.id, content });
    setVisible(false);
  }, [isVisible, content]);

  return (
    <div className="space-y-1 py-4">
      <Header author={data.author} createdAt={data.createdAt} />
      <p className="text-md line-clamp-3 md:text-lg">{data.content}</p>
      <Attachment url={data.embeddedGif} />
      {data.embeddedPost && (
        <div className="rounded-xl border border-gray-300 p-4 dark:border-neutral-600">
          <Header
            author={{ ...data.embeddedPost.author }}
            createdAt={data.embeddedPost.createdAt}
          />{" "}
          <Link
            href={{
              pathname: "",
              query: {
                id: data.embeddedPost.id,
              },
            }}
          >
            <p>{data.embeddedPost.content}</p>
            <Attachment url={data.embeddedPost.embeddedGif} />
          </Link>
        </div>
      )}
      <div className="inline-flex gap-x-6">
        <div className="inline-flex items-center space-x-1">
          <IconButton
            colorScheme="love"
            onClick={() => like.mutate({ tid: data.id })}
          >
            {data.selfLike ? (
              <AiFillHeart size={18} className="fill-pink-600" />
            ) : (
              <AiOutlineHeart size={18} />
            )}
          </IconButton>
          <span
            className={classNames(
              "cursor-default font-medium",
              data.selfLike ? "text-pink-600" : "text-gray-500"
            )}
          >
            {data._count.likes}
          </span>
        </div>

        <div className="inline-flex items-center space-x-1">
          <IconButton
            colorScheme="tree"
            onClick={() => setVisible(() => !isVisible)}
            className={classNames(data.selfRepost ? "text-green-600" : "")}
          >
            <FiRepeat size={18} />
          </IconButton>
          <span
            className={classNames(
              "cursor-default font-medium",
              data.selfRepost ? "text-green-600" : "text-gray-500"
            )}
          >
            {data._count.reposts}
          </span>
        </div>
      </div>
      {isVisible && !data.selfRepost && (
        <div className="inline-flex w-full gap-x-4">
          <Input
            className="w-full rounded p-2 outline-none"
            placeholder="what do you think?"
            onChange={(e) => setContent(() => e.target.value)}
          />
          <Button
            disabled={repost.isLoading || content.length === 0}
            onClick={repostHandler}
          >
            Retwat
          </Button>
        </div>
      )}
    </div>
  );
};

interface PostHeaderProps {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
}

const Attachment: FC<{ url: string | null }> = ({ url }) => {
  const [isError, setError] = useState<boolean>(false);
  if (!url) return null;

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg shadow">
      {isError ? (
        <div>
          <span>there was some error loading this cool GIF 😑</span>
        </div>
      ) : (
        <Image
          fill
          alt=""
          className="bg-gray-200 object-contain dark:bg-neutral-950"
          src={url}
          onError={() => setError(() => true)}
        />
      )}
    </div>
  );
};

const Header: FC<PostHeaderProps> = ({ author, createdAt }) => {
  return (
    <div className="inline-flex w-full items-center justify-start gap-x-2">
      <UserAvatar size="sm" src={author.image} />
      <div className="inline-flex space-x-4">
        <Link
          href={{
            pathname: "profile",
            query: {
              id: author.id,
            },
          }}
          className="cursor-pointer font-bold hover:underline"
        >
          {author.name}
        </Link>
        <span className="text-gray-300">{relativeFormatTime(createdAt)}</span>
      </div>
    </div>
  );
};

const updatePostCache = async (
  apiContext: ReturnType<typeof api.useContext>,
  tid: string
) => {
  const updatedPost = await apiContext.posts.get.fetch({ tid });

  apiContext.feed.setInfiniteData({}, (cache) => {
    if (!cache || cache.pages[0] == null) return;

    return {
      pageParams: [],
      pages: cache.pages.map((page) => ({
        ...page,
        posts: page.posts.map((cachedPost) => {
          if (cachedPost.id === tid) {
            console.log(updatedPost);

            return updatedPost || cachedPost;
          }
          return cachedPost;
        }),
      })),
    };
  });
};

export default Post;
