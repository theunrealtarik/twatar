import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

const IconButtonStyles = cva(
  "px-2 py-2 border border-transparent rounded-full text-gray-500 transition-all text-xs",
  {
    variants: {
      colorScheme: {
        primary:
          "bg-opacity-0 hover:bg-opacity-25 bg-sky-600 hover:text-sky-600 focus:ring-sky-200",
        tree: "bg-opacity-0 hover:bg-opacity-25 bg-green-600 hover:text-green-600 focus:ring-green-200",
        love: "bg-opacity-0 hover:bg-opacity-25 bg-pink-600 hover:text-pink-600 focus:ring-pink-200",
      },
    },
    defaultVariants: {
      colorScheme: "primary",
    },
  }
);

interface IconButtonProps
  extends DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    VariantProps<typeof IconButtonStyles> {}

const IconButton: FC<IconButtonProps> = ({ colorScheme, ...props }) => {
  return (
    <button
      {...props}
      className={IconButtonStyles({ colorScheme, className: props.className })}
    >
      {props.children}
    </button>
  );
};

export default IconButton;
