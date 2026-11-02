import type { SupportCase } from "@/types/supportCase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { cn } from "@/lib/classNames";

export const STATUS_MAP: Record<
  string,
  { label: string; variant: BadgeProps["variant"] }
> = {
  open: { label: "Open", variant: "default" },
  "in-progress": { label: "In Progress", variant: "warning" },
  closed: { label: "Closed", variant: "neutral" },
};

export const PRIORITY_MAP: Record<
  string,
  { label: string; variant: BadgeProps["variant"] }
> = {
  low: { label: "Low", variant: "neutral" },
  medium: { label: "Medium", variant: "default" },
  high: { label: "High", variant: "warning" },
  critical: { label: "Critical", variant: "danger" },
};

interface TicketCardProps {
  supportCase: SupportCase;
  onSelect: (caseItem: SupportCase) => void;
}

export function TicketCard({ supportCase, onSelect }: TicketCardProps) {
  const { id, customer, subject, status, priority, agentId, updatedAt } =
    supportCase;
  const statusInfo = STATUS_MAP[status];
  const priorityInfo = PRIORITY_MAP[priority];

  return (
    <Card padding="md" className="ticket-card">
      <div className="ticket-card__header">
        <span className="ticket-card__id">{id}</span>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      <h2 className="ticket-card__subject">
        <button
          className="ticket-card__subject-button"
          type="button"
          onClick={() => onSelect(supportCase)}
        >
          {subject}
        </button>
      </h2>

      <div className="ticket-card__body">
        <div className="ticket-card__field">
          <span className="ticket-card__label">Customer</span>
          <span className="ticket-card__value">{customer}</span>
        </div>

        <div className="ticket-card__field">
          <span className="ticket-card__label">Priority</span>
          <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
        </div>

        <div className="ticket-card__field">
          <span className="ticket-card__label">Agent</span>

          <span
            className={cn(
              "ticket-card__value",
              !agentId && "ticket-card__value--empty",
            )}
          >
            {agentId || "Unassigned"}
          </span>
        </div>

        <div className="ticket-card__field">
          <span className="ticket-card__label">Updated</span>
          <span className="ticket-card__value">
            {formatRelativeTime(updatedAt)}
          </span>
        </div>
      </div>
    </Card>
  );
}
