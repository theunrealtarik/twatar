import Image from "next/image";
import type { FC } from "react";
import { classNames } from "@/common/lib/utils";

interface ErrorProps {
  className?: string;
}

const Error: FC<ErrorProps> = ({ className }) => {
  return (
    <div className={classNames("relative h-24 w-24", className ?? "")}>
      <Image
        fill
        src="https://media.tenor.com/U5QXJDAXq_AAAAAi/erro.gif"
        alt="error gif"
      />
    </div>
  );
};

export default Error;
