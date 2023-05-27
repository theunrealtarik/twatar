import { type VariantProps, cva } from "class-variance-authority";
import type { FC, DetailedHTMLProps, InputHTMLAttributes } from "react";

interface InputProps
  extends DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    VariantProps<typeof InputStyles> {}

const InputStyles = cva(
  "px-4 py-2 rounded-full border border-gray-300 dark:border-neutral-600 bg-gray-100 dark:bg-zinc-950 text-gray-500 dark:text-gray-500 font-medium",
  {
    variants: {
      colorScheme: {
        primary: "focus:border-sky-600 outline-none",
      },
    },
    defaultVariants: {
      colorScheme: "primary",
    },
  }
);

const Input: FC<InputProps> = ({ colorScheme, className, ...props }) => {
  return (
    <input
      {...props}
      className={InputStyles({
        colorScheme,
        className,
      })}
    />
  );
};

export default Input;
