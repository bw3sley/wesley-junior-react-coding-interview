import { useState, useEffect } from "react";
import type { SupportAgent, SupportCase } from "@/types/supportCase";
import { fetchAgents, fetchCases } from "@/data/mockApi";
import { AgentsTable } from "./agentsTable";
import { ListSkeleton } from "./listSkeleton";

export function AgentList() {
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [tickets, setTickets] = useState<SupportCase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataState, setDataState] = useState<"loading" | "error" | "ready">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    setDataState("loading");
    setErrorMessage("");

    Promise.all([fetchAgents(), fetchCases()])
      .then(([agentData, ticketData]) => {
        if (!cancelled) {
          setAgents(agentData);
          setTickets(ticketData);
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
    return <ListSkeleton kind="agents" />;
  }

  if (dataState === "error") {
    return (
      <div className="ticket-list-state">
        <p>Something went wrong.</p>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="ticket-list-state">
        <p>No agents found.</p>
      </div>
    );
  }

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredAgents = normalizedQuery
    ? agents.filter((agent) =>
        `${agent.firstName} ${agent.lastName} ${agent.email}`
          .toLocaleLowerCase()
          .includes(normalizedQuery),
      )
    : agents;

  return (
    <div className="agent-list">
      <label className="search-field" htmlFor="agent-list-search">
        <span className="search-field__label">Search agents</span>

        <input
          id="agent-list-search"
          className="search-field__input"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by name or email"
        />
      </label>
      
      {filteredAgents.length > 0 ? (
        <AgentsTable agents={filteredAgents} tickets={tickets} />
      ) : (
        <div className="ticket-list-state">No agents match your search.</div>
      )}
    </div>
  );
}
