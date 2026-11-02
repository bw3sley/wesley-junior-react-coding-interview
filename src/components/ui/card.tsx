import { cn } from "@/lib/classNames";
import type { ComponentProps } from "react";

const paddingClasses = {
  none: "",
  md: "card--padding-md",
  lg: "card--padding-lg",
};

interface CardProps extends ComponentProps<"div"> {
  padding?: "none" | "md" | "lg";
}

export function Card({
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "card",
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
