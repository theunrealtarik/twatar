import { RouterOutputs, api } from "@/common/server/api";
import { FC, useCallback, useState } from "react";

import UserAvatar from "../Display/UserAvatar";
import Button from "../UI/Button";
import Input from "../UI/Input";
import IconButton from "../UI/IconButton";

import Link from "next/link";
import Image from "next/image";

import { FiRepeat } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { classNames, relativeFormatTime } from "@/common/lib/utils";

interface TwatCardProps {
  data: RouterOutputs["feed"]["twats"][number];
}

const TwatCard: FC<TwatCardProps> = ({ data }) => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const context = api.useContext();
  const onSuccess = async () => {
    await updateTwatCache(context, data.id);
  };

  const retwat = api.twats.retwat.useMutation({ onSuccess });
  const like = api.twats.like.useMutation({ onSuccess });

  const retwatHandler = useCallback(() => {
    retwat.mutate({ tid: data.id, content });
    setVisible(false);
  }, [isVisible, content]);

  return (
    <div className="space-y-1 py-4">
      <Header author={data.author} createdAt={data.createdAt} />
      <p className="text-md line-clamp-3 md:text-lg">{data.content}</p>
      <Attachment url={data.embeddedGif} />
      {data.embeddedTwat && (
        <div className="rounded-xl border border-gray-300 p-4 dark:border-neutral-600">
          <Header
            author={{ ...data.embeddedTwat.author }}
            createdAt={data.embeddedTwat.createdAt}
          />{" "}
          <Link
            href={{
              pathname: "",
              query: {
                id: data.embeddedTwat.id,
              },
            }}
          >
            <p>{data.embeddedTwat.content}</p>
            <Attachment url={data.embeddedTwat.embeddedGif} />
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
            className={classNames(data.selfRetwat ? "text-green-600" : "")}
          >
            <FiRepeat size={18} />
          </IconButton>
          <span
            className={classNames(
              "cursor-default font-medium",
              data.selfRetwat ? "text-green-600" : "text-gray-500"
            )}
          >
            {data._count.retwats}
          </span>
        </div>
      </div>
      {isVisible && !data.selfRetwat && (
        <div className="inline-flex w-full gap-x-4">
          <Input
            className="w-full rounded p-2 outline-none"
            placeholder="what do you think?"
            onChange={(e) => setContent(() => e.target.value)}
          />
          <Button
            disabled={retwat.isLoading || content.length === 0}
            onClick={retwatHandler}
          >
            Retwat
          </Button>
        </div>
      )}
    </div>
  );
};

interface TwatHeaderProps {
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

const Header: FC<TwatHeaderProps> = ({ author, createdAt }) => {
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

const updateTwatCache = async (
  apiContext: ReturnType<typeof api.useContext>,
  tid: string
) => {
  const updatedTwat = await apiContext.twats.get.fetch({ tid });

  apiContext.feed.setInfiniteData({}, (cache) => {
    if (!cache || cache.pages[0] == null) return;

    return {
      pageParams: [],
      pages: cache.pages.map((page) => ({
        ...page,
        twats: page.twats.map((cachedTwat) => {
          if (cachedTwat.id === tid) {
            console.log(updatedTwat);

            return updatedTwat || cachedTwat;
          }
          return cachedTwat;
        }),
      })),
    };
  });
};

export default TwatCard;
