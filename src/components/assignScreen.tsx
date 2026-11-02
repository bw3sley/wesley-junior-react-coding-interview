import { useState } from "react";
import type { SupportCase } from "@/types/supportCase";
import { agents } from "@/data/agents";
import { assignAgent } from "@/data/mockApi";
import { formatDateTime } from "@/lib/formatDate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

const PRIORITY_MAP: Record<
  string,
  { label: string; variant: BadgeProps["variant"] }
> = {
  low: { label: "Low", variant: "neutral" },
  medium: { label: "Medium", variant: "default" },
  high: { label: "High", variant: "warning" },
  critical: { label: "Critical", variant: "danger" },
};

const CATEGORY_MAP: Record<
  string,
  { label: string; variant: BadgeProps["variant"] }
> = {
  billing: { label: "Billing", variant: "default" },
  technical: { label: "Technical", variant: "warning" },
  account: { label: "Account", variant: "success" },
};

interface AssignScreenProps {
  supportCase: SupportCase;
  onBack: () => void;
}

export function AssignScreen({ supportCase, onBack }: AssignScreenProps) {
  const [currentCase, setCurrentCase] = useState(supportCase);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [agentSearch, setAgentSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const {
    id,
    subject,
    priority,
    category,
    status,
    agentId,
    description,
    deadline,
    customerTier,
  } = currentCase;
  const priorityInfo = PRIORITY_MAP[priority];
  const categoryInfo = CATEGORY_MAP[category];
  const normalizedAgentSearch = agentSearch.trim().toLocaleLowerCase();
  const eligibleAgents = agents.filter((agent) => agent.specialty === category);
  const matchingAgents = normalizedAgentSearch
    ? eligibleAgents.filter((agent) =>
        `${agent.firstName} ${agent.lastName} ${agent.email}`
          .toLocaleLowerCase()
          .includes(normalizedAgentSearch),
      )
    : eligibleAgents;
  const assignedAgent = agents.find((agent) => agent.id === agentId);
  const assignable = status === "open" && agentId === null;

  async function handleAssign() {
    if (isAssigning || !assignable || !selectedAgentId) return;

    setError("");
    setSuccess("");
    setIsAssigning(true);

    try {
      const updatedCase = await assignAgent(id, selectedAgentId);
      setCurrentCase({ ...updatedCase });
      setSuccess(
        `Assigned to ${agents.find((agent) => agent.id === selectedAgentId)?.firstName ?? "agent"}.`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsAssigning(false);
    }
  }

  return (
    <div className="assign-screen">
      <Button
        type="button"
        className="assign-screen__back"
        onClick={onBack}
        disabled={isAssigning}
      >
        Back to tickets
      </Button>
      <Card padding="md" className="assign-screen__case">
        <div className="assign-screen__header">
          <span className="ticket-card__id">{id}</span>
          <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
        </div>
        <h2 className="assign-screen__subject">{subject}</h2>

        <div className="assign-screen__meta">
          <span>
            Category:{" "}
            <Badge variant={categoryInfo.variant}>{categoryInfo.label}</Badge>
          </span>
          <span>Status: {status}</span>
          <span>Deadline: {formatDateTime(deadline)}</span>
          <span>Customer tier: {customerTier}</span>
          <span>
            Agent:{" "}
            {assignedAgent
              ? `${assignedAgent.firstName} ${assignedAgent.lastName}`
              : "Unassigned"}
          </span>
        </div>

        <p className="assign-screen__description">{description}</p>
      </Card>

      {!assignable ? (
        <Card padding="md" className="assign-screen__form">
          {success ? (
            <p className="assign-screen__success" role="status">
              {success} The ticket is now in progress.
            </p>
          ) : (
            <p className="assign-screen__hint">
              Only open, unassigned tickets can be assigned.
            </p>
          )}
        </Card>
      ) : (
        <Card padding="md" className="assign-screen__form">
          <label className="search-field" htmlFor="agent-search">
            <span className="search-field__label">Search agents</span>
            <input
              id="agent-search"
              className="search-field__input"
              type="search"
              value={agentSearch}
              disabled={isAssigning}
              onChange={(event) => {
                setAgentSearch(event.target.value);
                setSelectedAgentId("");
              }}
              placeholder="Search by name or email"
            />
          </label>
          <label className="assign-screen__label" htmlFor="agent-select">
            Choose agent in {category}
          </label>
          <select
            id="agent-select"
            className="assign-screen__select"
            value={selectedAgentId}
            disabled={isAssigning}
            onChange={(e) => setSelectedAgentId(e.target.value)}
          >
            <option value="">-- Select an agent --</option>
            {matchingAgents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.firstName} {agent.lastName}
              </option>
            ))}
          </select>
          {matchingAgents.length === 0 && (
            <p className="assign-screen__hint">
              {eligibleAgents.length === 0
                ? "No agents match this ticket's category."
                : "No agents match your search."}
            </p>
          )}

          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={!selectedAgentId || isAssigning}
          >
            {isAssigning && <Spinner size="sm" />}
            {isAssigning ? "Assigning..." : "Assign"}
          </Button>

          <div role="status" aria-live="polite">
            {isAssigning && <span className="sr-only">Assigning agent...</span>}
            {error && (
              <p className="assign-screen__error" role="alert">
                {error}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
