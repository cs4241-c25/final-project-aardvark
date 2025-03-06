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
          "px-4 py-2 rounded transition-all disabled:opacity-55 flex gap-2 justify-center items-center font-funnel",
          {
            "bg-foreground text-background hover:scale-105": variant === "primary",
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

type IconButtonProps = React.ComponentProps<"button"> & {
  icon: React.ReactNode;
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "hover:bg-inset rounded transition-colors md:p-3 p-2",
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
// Add display name to fix the ESLint warning
IconButton.displayName = "IconButton";

export { Button, IconButton };