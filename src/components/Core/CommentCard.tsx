import { RouterOutputs } from "@/common/server/api";
import React from "react";
import UserAvatar from "../Display/UserAvatar";
import Link from "next/link";
import { relativeFormatTime } from "@/common/lib/utils";

interface CommentCardProps {
  data: RouterOutputs["comments"]["all"]["comments"][number];
}

const CommentCard: React.FC<CommentCardProps> = ({ data }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-x-2">
        <UserAvatar size="sm" src={data.user.image} />
        <div className="flex-1">
          <div className="inline-flex space-x-4">
            <Link
              href={{
                pathname: "/profile/",
                query: {
                  id: data.user.id,
                },
              }}
              className="cursor-pointer font-bold hover:underline"
            >
              {data.user.name}
            </Link>
            <span className="text-gray-500">
              {relativeFormatTime(data.createdAt)}
            </span>
          </div>
          <p>{data.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
