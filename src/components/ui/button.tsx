"use client";

import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "icon";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none";
    const variants =
      variant === "outline"
        ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        : "bg-primary text-primary-foreground hover:opacity-90";
    const sizes =
      size === "sm"
        ? "h-8 px-3 text-sm"
        : size === "icon"
        ? "h-8 w-8"
        : "h-10 px-4";
    return (
      <button ref={ref} className={`${base} ${variants} ${sizes} ${className}`} {...props} />
    );
  }
);
Button.displayName = "Button";

export default Button;


