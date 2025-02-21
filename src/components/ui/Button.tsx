import clsx from "clsx";
import React from "react";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "px-4 py-2 rounded-full transition-colors disabled:opacity-55",
          {
            "bg-foreground text-background": variant === "primary",
            "border border-foreground text-foreground": variant === "secondary",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Add display name to fix the ESLint warning
Button.displayName = "Button";

export default Button;
