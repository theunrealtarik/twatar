import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

const ButtonStyles = cva(
  "cursor-pointer disabled:cursor-not-allowed border focus:ring-1 transition-colors px-3 py-1 font-medium text-sm rounded-full inline-flex items-center outline-none",
  {
    variants: {
      intent: {
        primary:
          "border-transparent text-white bg-sky-600 hover:bg-sky-700 focus:ring-sky-200 disabled:bg-gray-300 disabled:text-neutral-600 dark:disabled:bg-neutral-600 dark:disabled:text-neutral-800",
        secondary:
          "border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-600 text-gray-400 dark:text-white dark:hover:bg-neutral-500 hover:bg-gray-100 focus:ring-gray-300 dark:focus:ring-gray-500",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

interface ButtonProps
  extends DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    VariantProps<typeof ButtonStyles> {}

const Button: FC<ButtonProps> = ({ intent, ...props }) => {
  return (
    <button
      {...props}
      className={ButtonStyles({ intent, className: props.className })}
    >
      {props.children}
    </button>
  );
};

export default Button;
