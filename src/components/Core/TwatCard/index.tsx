import { RouterOutputs, api } from "@/common/server/api";
import { FC, useCallback, useState } from "react";

import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import IconButton from "@/components/UI/IconButton";

import Link from "next/link";

import { FiRepeat } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { classNames } from "@/common/lib/utils";

import TwatHeader from "./fragments/TwatHeader";
import TwatAttachment from "./fragments/TwatAttachment";
import EmbeddedTwat from "./fragments/EmbeddedTwat";

interface TwatCardProps {
  data: RouterOutputs["feed"]["twats"][number];
  lineClamp?: boolean;
  link?: boolean;
}

const TwatCard: FC<TwatCardProps> = ({
  data,
  lineClamp = true,
  link = true,
}) => {
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
      <TwatHeader author={data.author} createdAt={data.createdAt} />

      <p
        className={classNames(
          "text-md md:text-lg",
          lineClamp ? "line-clamp-2" : "line-clamp-none"
        )}
      >
        {link ? (
          <Link href={{ pathname: "/twat/".concat(data.id) }}>
            {data.content}
          </Link>
        ) : (
          data.content
        )}
      </p>
      <TwatAttachment url={data.attachment} />
      {data.embeddedTwat && <EmbeddedTwat data={data.embeddedTwat} />}
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
            return updatedTwat || cachedTwat;
          }
          return cachedTwat;
        }),
      })),
    };
  });
};

export default TwatCard;
