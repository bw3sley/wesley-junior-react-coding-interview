import { cn } from "@/lib/classNames";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  default: "badge--default",
  success: "badge--success",
  warning: "badge--warning",
  danger: "badge--danger",
  neutral: "badge--neutral",
};

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
