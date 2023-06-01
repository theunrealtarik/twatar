import React, { FC } from "react";
import TwatHeader from "./TwatHeader";
import TwatAttachment from "./TwatAttachment";

import Link from "next/link";
import type { Twat, User } from "@prisma/client";

interface EmbeddedTwatProps {
  data:
    | Twat & {
        author: User;
      };
}

const EmbeddedTwat: FC<EmbeddedTwatProps> = ({ data }) => {
  return (
    <div className="rounded-xl border border-gray-300 p-4 dark:border-neutral-600">
      <TwatHeader author={{ ...data.author }} createdAt={data.createdAt} />
      <Link
        href={{
          pathname: "/twat/",
          query: {
            id: data.id,
          },
        }}
      >
        <p>{data.content}</p>
        <TwatAttachment url={data.attachment} />
      </Link>
    </div>
  );
};

export default EmbeddedTwat;
