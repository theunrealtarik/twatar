import { classNames } from "@/common/lib/utils";
import Link from "next/link";
import React, { FC, Fragment } from "react";

interface TwatContentProps {
  content: string;
  lineClamp: boolean;
}

const TwatContent: FC<TwatContentProps> = ({ content, lineClamp = true }) => {
  const hashtagRegex = /#\w+/g;

  return (
    <div
      className={classNames(
        "text-md flex flex-wrap gap-x-1 md:text-lg",
        lineClamp ? "line-clamp-2" : "line-clamp-none"
      )}
    >
      {content.split("\n").map((line, lineIndex) => {
        const words = line.split(" ");

        return (
          <div key={lineIndex * 2}>
            {words.map((word, wordIndex) => {
              const isLastWord = wordIndex === words.length - 1;

              if (hashtagRegex.test(word) || word.startsWith("#")) {
                return (
                  <Fragment key={wordIndex}>
                    <Link
                      href={{
                        pathname: "/search/twats",
                        query: {
                          q: word,
                        },
                      }}
                      key={wordIndex}
                      className="font-medium text-sky-600 hover:underline"
                    >
                      {word}
                    </Link>
                    {!isLastWord && " "}
                  </Fragment>
                );
              } else {
                return (
                  <Fragment>
                    <span key={wordIndex} className={""}>
                      {word}
                    </span>
                    {!isLastWord && " "}
                  </Fragment>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

export default TwatContent;
