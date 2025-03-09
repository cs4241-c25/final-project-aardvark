import clsx from "clsx";
import React from "react";

type TextInputProps = React.ComponentProps<"input">

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="text"
        ref={ref}
        className={clsx(
          "block w-full font-funnel rounded py-1 px-2 dark:bg-background outline-none ring-1 dark:ring-neutral-500 ring-neutral-400 focus:ring-foreground dark:placeholder:text-neutral-500 transition-all",
          className
        )}
        {...props}
      />
    );
  }
)

export default TextInput;