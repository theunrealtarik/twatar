import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import useLocalStorage from "use-local-storage-state";

export function useScroll() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener("scroll", (e) => {
        const height = (document.documentElement.scrollHeight -
          document.documentElement.clientHeight) as number;
        const scrollTop =
          document.body.scrollTop ||
          (document.documentElement?.scrollTop as number);

        setScrollPosition((scrollTop / height) * 100);
      });
    }

    return () => {
      window.removeEventListener("scroll", () => null);
    };
  }, []);

  return scrollPosition;
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme");

  useEffect(() => {
    document.body.classList.value = theme ?? "light";
  }, [theme]);

  return { isToggled: theme === "dark", theme, setTheme };
}

export function useDebounceState<T>(duration: number, value: T) {
  const [debounceValue, setDebounceValue] = useState<T | undefined>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounceValue(value);
    }, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value]);

  return debounceValue;
}

interface IUseFileHandlerOptions {
  /**
   * Maximum file size in bytes
   */
  maxFileSize?: number;
  onlyImages?: boolean;
  onError?: () => void;
  onSuccess?: () => void;
  onNoFiles?: () => void;
}

export function useFileHandler({
  maxFileSize,
  onlyImages,
  ...options
}: IUseFileHandlerOptions) {
  const [file, setFile] = useState<
    { base64: string; fileName: string } | undefined
  >(undefined);

  const handler = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
      callback?: (result: string | ArrayBuffer, file: File) => void
    ) => {
      const files = event.target.files as FileList;
      const allowedExtensions = /(\.png|\.jpeg|\.jpg)$/i;

      if (!files || files.length === 0) {
        if (options.onNoFiles != undefined) options.onNoFiles();
        return;
      }

      const fileReader = new FileReader();
      const file = files.item(0) as File;

      if (onlyImages && !allowedExtensions.exec(event.target.value)) {
        alert("Please select a PNG or JPEG file, dummy");
        event.target.value = "";
        return;
      }

      fileReader.onload = () => {
        const result = fileReader.result;
        if (maxFileSize && file.size >= maxFileSize) {
          if (maxFileSize != undefined)
            alert("Image exceeds maximum file size");
          return;
        }
        if (result) {
          setFile(() => ({
            base64: result.toString(),
            fileName: file.name,
          }));
          if (callback != undefined) callback(result, file);
        }
      };

      fileReader.readAsDataURL(file as Blob);
    },
    [setFile]
  );

  return {
    file,
    handler,
  };
}
