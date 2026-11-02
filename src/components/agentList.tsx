import { useState, useEffect } from "react";
import type { SupportAgent } from "@/types/supportCase";
import { fetchAgents } from "@/data/mockApi";
import { AgentCard } from "./agentCard";

export function AgentList() {
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [dataState, setDataState] = useState<"loading" | "error" | "ready">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    setDataState("loading");
    setErrorMessage("");

    fetchAgents()
      .then((data) => {
        if (!cancelled) {
          setAgents(data);
          setDataState("ready");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setDataState("error");
          setErrorMessage(
            err instanceof Error ? err.message : "An unexpected error occurred",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (dataState === "loading") {
    return null;
  }

  if (dataState === "error" || agents.length === 0) {
    return (
      <div className="ticket-list-state">
        <p>Something went wrong.</p>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="agent-list">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
