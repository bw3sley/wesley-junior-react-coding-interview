type ListSkeletonProps = {
  kind: "tickets" | "agents";
};

const columns = {
  tickets: ["Ticket", "Customer", "Status", "Priority", "Agent", "Updated"],
  agents: ["Agent", "Area", "Ticket count"],
};

export function ListSkeleton({ kind }: ListSkeletonProps) {
  const isTickets = kind === "tickets";

  return (
    <div className="list-skeleton" role="status" aria-live="polite">
      <span className="sr-only">Loading {kind}...</span>
      <div className="list-skeleton__table" aria-hidden="true">
        <table className="data-table">
          <thead>
            <tr>
              {columns[kind].map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, row) => (
              <tr key={row}>
                {columns[kind].map((column, index) => (
                  <td key={column}>
                    {index === 0 ? (
                      <div className="list-skeleton__primary">
                        <span className="list-skeleton__line list-skeleton__line--short" />
                        <span className="list-skeleton__line list-skeleton__line--long" />
                      </div>
                    ) : (
                      <span
                        className={`list-skeleton__line ${
                          (isTickets && index === 2) || (!isTickets && index === 1)
                            ? "list-skeleton__line--badge"
                            : !isTickets && index === 2
                              ? "list-skeleton__line--count"
                            : ""
                        }`}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="list-skeleton__cards" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="list-skeleton__card" key={index}>
            {isTickets ? (
              <>
                <div className="list-skeleton__card-top">
                  <span className="list-skeleton__line list-skeleton__line--short" />
                  <span className="list-skeleton__line list-skeleton__line--badge" />
                </div>
                <span className="list-skeleton__line list-skeleton__line--title" />
                <span className="list-skeleton__line list-skeleton__line--medium" />
                <div className="list-skeleton__card-details">
                  <span className="list-skeleton__line" />
                  <span className="list-skeleton__line" />
                </div>
              </>
            ) : (
              <>
                <div className="list-skeleton__agent">
                  <span className="list-skeleton__avatar" />
                  <div className="list-skeleton__primary">
                    <span className="list-skeleton__line list-skeleton__line--medium" />
                    <span className="list-skeleton__line list-skeleton__line--long" />
                  </div>
                </div>
                <div className="list-skeleton__card-top">
                  <span className="list-skeleton__line list-skeleton__line--badge" />
                  <span className="list-skeleton__line list-skeleton__line--count" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
