import React, { FC } from "react";
import TwatHeader from "./TwatHeader";
import TwatAttachment from "./TwatAttachment";

import Link from "next/link";
import type { Twat, User } from "@prisma/client";
import TwatContent from "./TwatContent";

interface EmbeddedTwatProps {
  data:
    | Twat & {
        author: User;
      };
}

const EmbeddedTwat: FC<EmbeddedTwatProps> = ({ data }) => {
  return (
    <div className="rounded-xl border border-gray-300 p-4 dark:border-neutral-600">
      <TwatHeader
        author={{ ...data.author }}
        createdAt={data.createdAt}
        id={data.id}
        showDeleteButton={false}
      />
      <Link
        href={{
          pathname: "/twat/" + data.id,
        }}
      >
        <TwatContent content={data.content} lineClamp={true} />
        <TwatAttachment url={data.attachment} />
      </Link>
    </div>
  );
};

export default EmbeddedTwat;
