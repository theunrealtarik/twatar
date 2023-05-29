import { RouterInputs, api } from "@/common/server/api";
import { useScroll } from "@/hooks";
import { FC, useEffect } from "react";

import Loading from "../Feedback/Loading";
import TwatCard from "./TwatCard";
import Image from "next/image";

interface FeedProps {
  filters?: RouterInputs["feed"]["filters"];
}

const Feed: FC<FeedProps> = ({ filters }) => {
  const scrollPos = useScroll(null);
  const feed = api.feed.useInfiniteQuery(
    {
      filters,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (scrollPos > 90 && feed.hasNextPage && !feed.isFetching) {
      feed.fetchNextPage();
    }
  }, [scrollPos]);

  const twats = feed.data?.pages.flatMap((page) => page.twats) ?? [];
  const isAmerican =
    !feed.hasNextPage &&
    feed.data?.pages &&
    feed.data.pages.length > 2 &&
    twats.length > 0;

  if (feed.isLoading && !feed.data) {
    return (
      <div className="py-16">
        <Loading />
      </div>
    );
  }

  return (
    <div className="divide-y-gray-300 space-y-2 divide-y p-4 dark:divide-neutral-600">
      {twats.map((twat) => (
        <TwatCard key={twat.id} data={twat} />
      ))}
      {isAmerican && (
        <div className="mx-auto w-full py-4">
          <div className="inline-flex w-full items-center justify-center gap-x-2">
            <Image
              src="https://media.tenor.com/W8ImMlYbR2EAAAAC/byuntear-incrives-meme.gif"
              alt=""
              height={150}
              width={150}
            />
            <span className="font-bold">
              Congrats! Now you&apos;re an american
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
