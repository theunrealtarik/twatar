import Image from "next/image";
import Input from "./UI/Input";

import { type FC, useState, useEffect } from "react";
import { api } from "@/common/server/api";
import { classNames, randInt } from "@/common/lib/utils";
import { useDebounce } from "usehooks-ts";

interface GifPickerProps {
  onChoose: (attachment: IAttachment | undefined) => void;
}

const GifPicker: FC<GifPickerProps> = ({ onChoose }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const gifs = api.tenor.gifs.useInfiniteQuery(
    {
      query: debouncedQuery,
    },
    {
      getNextPageParam: (lastPage) => lastPage.next,
    }
  );
  let data = gifs.data?.pages.flatMap((page) => page.gifs);

  useEffect(() => {
    gifs.refetch();
  }, [debouncedQuery]);

  return (
    <div className="black:bg-neutral-900 scroll-bar-none relative h-96 w-96 overflow-y-auto rounded-lg border border-gray-300 shadow dark:border-neutral-600 dark:bg-neutral-950">
      <div className="sticky top-0 w-full border-b border-gray-300 bg-white p-2 pb-2 shadow dark:border-neutral-600 dark:bg-neutral-900">
        <p className="w-full font-bold">
          <span className="uppercase">gif</span>
          <span>s</span>
        </p>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="try: el bnwa"
          className="w-full rounded-md"
        />
      </div>
      <div className="mt-2 columns-2 gap-2 p-2">
        {data?.map((category, index) => (
          <div key={category.id + index} className="mb-2 break-inside-avoid">
            <GifCard
              data={category}
              onClick={(attachment) => onChoose(attachment)}
            />
          </div>
        ))}
      </div>
      {gifs.data && gifs.hasNextPage && (
        <div className="my-4 inline-flex w-full justify-center">
          <span
            className="link cursor-pointer transition-all hover:underline"
            onClick={() => gifs.fetchNextPage()}
          >
            load more ...
          </span>
        </div>
      )}
    </div>
  );
};

const GifCard: FC<{
  onClick: (attachment: IAttachment | undefined) => void;
  data: GIF;
}> = ({ data, onClick }) => {
  const [src, setSrc] = useState(data.media_formats.gif?.url);
  return (
    <div
      className={classNames(
        "cursor-pointer overflow-hidden rounded border border-neutral-300",
        "ring-sky-500 ring-opacity-25 hover:ring-4"
      )}
      onClick={() =>
        onClick({
          name: data.title,
          url: data.media_formats.gif?.url,
          type: "gif",
        })
      }
    >
      <Image
        alt={data.title}
        src={src ?? ""}
        onError={() => setSrc("/loading.gif")}
        // fill
        width={200}
        height={100}
        className={classNames(
          // "object-cover",
          `bg-gray-200`
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default GifPicker;
