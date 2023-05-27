import Image from "next/image";
import { FC } from "react";

interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
  return (
    <div className="text-center">
      <Image
        className="mx-auto"
        alt="an original loading spinner"
        src="/loading.gif"
        width={100}
        height={100}
      />
      <p>Loading ...</p>
    </div>
  );
};

export default Loading;
