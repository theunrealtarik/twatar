import Image from "next/image";
import { type FC, useState } from "react";

const TwatAttachment: FC<{ url: string | null }> = ({ url }) => {
  const [isError, setError] = useState<boolean>(false);
  if (!url) return null;

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg shadow">
      {isError ? (
        <div>
          <span>there was some error loading this cool GIF 😑</span>
        </div>
      ) : (
        <Image
          fill
          alt=""
          className="bg-gray-200 object-contain dark:bg-neutral-950"
          src={url}
          onError={() => setError(() => true)}
        />
      )}
    </div>
  );
};

export default TwatAttachment;
