import { classNames } from "@/common/lib/utils";
import Link from "next/link";
import React, { FC, Fragment } from "react";

interface TwatContentProps {
  content: string;
  lineClamp: boolean;
}

const TwatContent: FC<TwatContentProps> = ({ content, lineClamp = true }) => {
  return (
    <p
      className={classNames(
        "text-md space-x-1 md:text-lg",
        lineClamp ? "line-clamp-2" : "line-clamp-none"
      )}
    >
      {content.split(" ").map((word) => {
        if (word.startsWith("#"))
          return (
            <Link
              href={{
                pathname: "/search/tags",
                query: {
                  h: word,
                },
              }}
              className="font-medium text-sky-600 hover:underline"
            >
              {word}
            </Link>
          );
        else return <span>word</span>;
      })}
    </p>
  );
};

export default TwatContent;
