import { cn } from "@/lib/classNames";

interface SpinnerProps {
  size?: "sm" | "md";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <svg
      className={cn(
        "spinner",
        size === "sm" ? "spinner--sm" : "spinner--md",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="spinner__track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="spinner__indicator"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
