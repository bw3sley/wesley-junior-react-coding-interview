import { format as dateFnsFormat } from "date-fns";

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return dateFnsFormat(d, "MMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return dateFnsFormat(d, "MMM d, yyyy h:mm a");
}
