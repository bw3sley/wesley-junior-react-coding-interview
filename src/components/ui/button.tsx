import { cn } from "@/lib/classNames";
import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
};

export function Button({ variant = "secondary", className, children, ...props }: ButtonProps) {
  return (
    <button className={cn("btn", variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
}
