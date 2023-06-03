import { type VariantProps, cva } from "class-variance-authority";
import type {
  FC,
  DetailedHTMLProps,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface TextareaProps
  extends DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    VariantProps<typeof TextareaStyles> {}

const TextareaStyles = cva(
  "px-4 py-2 rounded-full border dark:placeholder:text-zinc-500 border-gray-300 dark:border-neutral-600 bg-gray-100 dark:bg-zinc-950 text-gray-600 dark:text-gray-400 font-medium dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600 disabled:bg-gray-200 disabled:text-gray-400",
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

const Textarea: FC<TextareaProps> = ({ colorScheme, className, ...props }) => {
  return (
    <textarea
      {...props}
      className={TextareaStyles({
        colorScheme,
        className,
      })}
    ></textarea>
  );
};

export default Textarea;
