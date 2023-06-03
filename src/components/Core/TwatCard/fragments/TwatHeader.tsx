import { relativeFormatTime } from "@/common/lib/utils";
import UserAvatar from "@/components/Display/UserAvatar";
import Link from "next/link";
import { type FC } from "react";

interface TwatHeaderProps {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  createdAt: Date;
}

const TwatHeader: FC<TwatHeaderProps> = ({ author, createdAt }) => {
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
        <span className="text-gray-500">{relativeFormatTime(createdAt)}</span>
      </div>
    </div>
  );
};

export default TwatHeader;
