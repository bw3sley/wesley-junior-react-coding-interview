import { useState, useEffect, useMemo, useDeferredValue } from "react";
import type { SupportCase } from "@/types/supportCase";
import { fetchCases } from "@/data/mockApi";
import { TicketsTable } from "./ticketsTable";
import { ListSkeleton } from "./listSkeleton";

interface TicketListProps {
  onSelectCase: (caseItem: SupportCase) => void;
}

export function TicketList({ onSelectCase }: TicketListProps) {
  const [tickets, setTickets] = useState<SupportCase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataState, setDataState] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase();

  const filteredTickets = useMemo(
    () =>
      normalizedQuery
        ? tickets.filter((ticket) =>
            [
              ticket.id,
              ticket.subject,
              ticket.customer,
              ticket.customerEmail,
            ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
          )
        : tickets,
    [tickets, normalizedQuery],
  );

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
    return <ListSkeleton kind="tickets" />;
  }

  if (dataState === "error") {
    return (
      <div className="ticket-list-state">
        <p>Something went wrong.</p>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="ticket-list-state">
        <p>No tickets found.</p>
      </div>
    );
  }

  return (
    <div className="ticket-list">
      <label className="search-field" htmlFor="ticket-search">
        <span className="search-field__label">Search tickets</span>

        <input
          id="ticket-search"
          className="search-field__input"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by ID, subject, or customer"
        />
      </label>

      {filteredTickets.length > 0 ? (
        <TicketsTable tickets={filteredTickets} onSelectCase={onSelectCase} />
      ) : (
        <div className="ticket-list-state">No tickets match your search.</div>
      )}
    </div>
  );
}
