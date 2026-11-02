import { useState, useEffect } from "react";
import type { SupportCase } from "@/types/supportCase";
import { fetchCases } from "@/data/mockApi";
import { TicketCard } from "./ticketCard";

interface TicketListProps {
  onSelectCase: (caseItem: SupportCase) => void;
}

export function TicketList({ onSelectCase }: TicketListProps) {
  const [tickets, setTickets] = useState<SupportCase[]>([]);
  const [dataState, setDataState] = useState<"loading" | "error" | "ready">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    setDataState("loading");
    setErrorMessage("");

    fetchCases()
      .then((data) => {
        if (!cancelled) {
          setTickets(data);
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

  if (dataState === "error" || tickets.length === 0) {
    return (
      <div className="ticket-list-state">
        <p>Something went wrong.</p>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="ticket-list">
      {tickets.map((supportCase) => (
        <TicketCard key={supportCase.id} supportCase={supportCase} onSelect={onSelectCase} />
      ))}
    </div>
  );
}
