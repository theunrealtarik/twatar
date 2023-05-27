import { type VariantProps, cva } from "class-variance-authority";
import { FC, useState } from "react";
import { FiUser } from "react-icons/fi";

import Image from "next/image";
import ErrorBoundary from "../Feedback/ErrorBoundary";

interface UserAvatarProps extends VariantProps<typeof UserAvatarStyles> {
  className?: string;
  src: string | null;
}

const UserAvatarStyles = cva(
  "relative overflow-hidden rounded-full grid place-content-center bg-gray-200",
  {
    variants: {
      size: {
        sm: "w-12 h-12",
        md: "w-16 h-16",
        lg: "w-24 h-24",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const UserAvatar: FC<UserAvatarProps> = ({ size, src, ...props }) => {
  const [isError, setError] = useState<boolean>(false);

  return (
    <div
      className={UserAvatarStyles({
        size,
        className: props.className,
      })}
    >
      {isError ? (
        <FiUser size={25} className="text-neutral-600" />
      ) : (
        <Image
          src={src ?? ""}
          alt="user avatar"
          fill
          draggable={false}
          placeholder="empty"
          onError={() => setError(() => true)}
        />
      )}
    </div>
  );
};

export default UserAvatar;
