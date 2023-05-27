import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "use-local-storage-state";

export function useScroll(element: HTMLElement | null) {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener("scroll", (e) => {
        if (!element) element = document.documentElement;
        const height = (element.scrollHeight - element.clientHeight) as number;
        const scrollTop =
          document.body.scrollTop || (element?.scrollTop as number);

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
