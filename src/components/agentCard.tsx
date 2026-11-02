import type { SupportAgent } from "@/types/supportCase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";

const SPECIALTY_MAP: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
  billing: { label: "Billing", variant: "default" },
  technical: { label: "Technical", variant: "warning" },
  account: { label: "Account", variant: "success" },
};

interface AgentCardProps {
  agent: SupportAgent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const { firstName, lastName, email, specialty } = agent;
  const specialtyInfo = SPECIALTY_MAP[specialty];

  return (
    <Card padding="md" className="agent-card">
      <div className="agent-card__header">
        <div className="agent-card__avatar">
          {firstName[0]}{lastName[0]}
        </div>
        <div className="agent-card__name-group">
          <h2 className="agent-card__name">{firstName} {lastName}</h2>
          <span className="agent-card__email">{email}</span>
        </div>
      </div>

      <div className="agent-card__footer">
        <span className="agent-card__label">Area:</span>
        <Badge variant={specialtyInfo.variant}>{specialtyInfo.label}</Badge>
      </div>
    </Card>
  );
}
