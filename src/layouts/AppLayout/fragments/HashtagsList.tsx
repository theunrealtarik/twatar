import { shortFormatNumber } from "@/common/lib/utils";
import { api } from "@/common/server/api";
import { Loading } from "@/components";

import Link from "next/link";
import React, { FC } from "react";

interface HashtagsListProps {}

const HashtagsList: FC<HashtagsListProps> = ({}) => {
  const hashtags = api.hashtags.useQuery();

  if (hashtags.data?.length === 0) return null;
  return (
    <div className="mt-4 w-full overflow-x-auto">
      <h4 className="text-2xl font-bold">Trends</h4>
      <div className="flex flex-col gap-y-1 rounded-xl bg-gray-100 p-2 dark:bg-neutral-950">
        {hashtags.isLoading && <Loading />}
        {hashtags.data &&
          hashtags.data.map((hashtag, index) => (
            <Link
              href={{
                pathname: "/search/tags",
                query: {
                  h: hashtag.name,
                },
              }}
              className="w-full rounded-lg px-2 py-1 transition hover:bg-gray-200 dark:hover:bg-neutral-900"
            >
              <div className="space-y-1">
                <p className="w-full text-lg font-bold dark:text-neutral-200">
                  {hashtag.name}
                </p>
                {index === 0 && <span>🔥</span>}
                <span className="font-medium text-gray-500">
                  {shortFormatNumber(hashtag._count.twats)}{" "}
                  {"Twat".concat(hashtag._count.twats === 1 ? "" : "s")}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default HashtagsList;
