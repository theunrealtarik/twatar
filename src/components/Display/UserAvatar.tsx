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
  "relative overflow-hidden grid place-content-center bg-gray-200 dark:bg-neutral-800",
  {
    variants: {
      size: {
        sm: "w-12 h-12",
        md: "w-16 h-16",
        lg: "w-24 h-24",
      },
      intent: {
        rounded: "rounded-full",
        square: "rounded-lg",
      },
    },
    defaultVariants: {
      size: "md",
      intent: "rounded",
    },
  }
);

const UserAvatar: FC<UserAvatarProps> = ({ size, intent, src, ...props }) => {
  const [isError, setError] = useState<boolean>(false);

  return (
    <div
      className={UserAvatarStyles({
        size,
        intent,
        className: props.className,
      })}
    >
      {isError ? (
        <FiUser size={25} className="text-neutral-600 dark:text-white" />
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
