import { classNames } from "@/common/lib/utils";
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useFileHandler } from "@/hooks";

interface ImageUploadControlProps {
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  overlayText?: ReactNode | string;
  children?: ReactNode;
  onChange?: (base64: string, fileName: string) => void;
  name?: string;
  src: string | null;
  mimeTypes?: string;
}

const ImageUploadControl: FC<ImageUploadControlProps> = ({
  className,
  children,
  mimeTypes = "image/png, image/jpeg",
  ...props
}) => {
  const image = useFileHandler({
    maxFileSize: 500_000,
    onlyImages: true,
  });
  const [src, setSrc] = useState<string | null>(props.src);
  const ref = useRef<HTMLInputElement>(null);

  const clickHandler = useCallback(() => {
    const fileInput = ref.current;
    if (fileInput) {
      fileInput?.click();
    }
  }, []);

  return (
    <div
      className={classNames(
        "group relative cursor-pointer overflow-hidden",
        className ?? ""
      )}
    >
      <div
        className={classNames(
          "absolute left-0 top-0 bg-opacity-0 group-hover:bg-opacity-50",
          "z-20 grid h-full w-full place-content-center",
          "bg-black transition-all duration-200",
          props.overlayClassName ?? ""
        )}
        onClick={clickHandler}
      >
        <span className="font-bold capitalize text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {props.overlayText ?? "edit"}
        </span>
      </div>
      <div
        className={classNames(
          "relative z-10 overflow-clip",
          props.imageClassName ?? ""
        )}
      >
        {src && <Image fill alt="" src={src} />}
      </div>
      <input
        type="file"
        ref={ref}
        name={props.name}
        className="hidden"
        accept={mimeTypes}
        multiple={false}
        onChange={(e) =>
          image.handler(e, (result, file) => {
            setSrc(() => result.toString());
            if (props.onChange != undefined) {
              props.onChange(result.toString(), file.name);
            }
          })
        }
      />
    </div>
  );
};

export default ImageUploadControl;
