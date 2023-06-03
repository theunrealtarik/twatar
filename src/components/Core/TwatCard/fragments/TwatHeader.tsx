import { relativeFormatTime } from "@/common/lib/utils";
import { useSession } from "next-auth/react";

import UserAvatar from "@/components/Display/UserAvatar";
import Link from "next/link";

import { useCallback, type FC } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { api } from "@/common/server/api";

interface TwatHeaderProps {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
  id: string;
}

const TwatHeader: FC<TwatHeaderProps> = ({ author, createdAt, id }) => {
  const { status, data } = useSession();
  const deleteTwat = api.twats.delete.useMutation({
    onSuccess: () => {
      updateFeed(api.useContext(), id);
    },
  });

  const deletionHandler = useCallback(() => {
    const isOk = confirm("Are you sure you want to delete this twat?");
    if (isOk && status === "authenticated" && data.user.id == author.id) {
      deleteTwat.mutate({ tid: id });
    }
  }, []);

  return (
    <div className="inline-flex w-full items-center justify-between gap-x-2">
      <div className="flex items-center gap-x-2">
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
          <span className="text-gray-500">{relativeFormatTime(createdAt)}</span>
        </div>
      </div>
      {status === "authenticated" && data.user.id === author.id && (
        <div>
          <button
            onClick={deletionHandler}
            className="text-gray-500 transition-colors duration-200 hover:text-sky-500 dark:text-neutral-500 dark:hover:text-sky-500"
          >
            <FaTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
};

const updateFeed = (
  context: ReturnType<typeof api.useContext>,
  tid: string
) => {
  context.hashtags.refetch();
  context.feed.setInfiniteData(
    {
      filters: {
        followingOnly: true,
      },
    },
    (cache) => {
      if (!cache || cache.pages[0] == null) return;
      return {
        pageParams: [],
        pages: cache?.pages.map((page) => {
          const deletedTwat = page.twats.findIndex(({ id }) => id === tid);
          if (deletedTwat > -1) {
            page.twats = page.twats.splice(deletedTwat, 1);
          }
          return {
            ...page,
          };
        }),
      };
    }
  );
};

export default TwatHeader;
