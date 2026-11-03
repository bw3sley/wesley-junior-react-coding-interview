import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { agents } from "@/data/agents";
import { fetchCases } from "@/data/mockApi";
import type { SupportCase } from "@/types/supportCase";
import { Card } from "./ui/card";
import { Spinner } from "./ui/spinner";

// recharts is heavy; load it in its own chunk instead of the main bundle.
const DashboardChart = lazy(() =>
  import("./dashboardChart").then((module) => ({
    default: module.DashboardChart,
  })),
);

export function DashboardScreen() {
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [dataState, setDataState] = useState<"loading" | "error" | "ready">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;

    fetchCases()
      .then((data) => {
        if (!cancelled) {
          setCases(data);
          setDataState("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setDataState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const result = {
      total: cases.length,
      open: 0,
      inProgress: 0,
      closed: 0,
      overdue: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const supportCase of cases) {
      if (supportCase.status === "open") result.open++;
      else if (supportCase.status === "in-progress") result.inProgress++;
      else if (supportCase.status === "closed") result.closed++;

      if (supportCase.status !== "closed" && supportCase.deadline < now) {
        result.overdue++;
      }

      result[supportCase.priority]++;
    }

    return result;
  }, [cases]);

  if (dataState === "loading") {
    return (
      <div className="dashboard__state" role="status">
        <Spinner />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (dataState === "error") {
    return (
      <div className="dashboard__state" role="alert">
        <p>Could not load tickets.</p>
      </div>
    );
  }

  const { total, open, inProgress, closed, overdue } = stats;

  const summary = [
    { label: "Total tickets", value: total },
    { label: "Open", value: open },
    { label: "In progress", value: inProgress },
    { label: "Overdue", value: overdue },
    { label: "Total agents", value: agents.length },
  ];

  const statusRows = [
    { label: "Open", count: open, color: "var(--color-blue-600)" },
    {
      label: "In progress",
      count: inProgress,
      color: "var(--color-yellow-500)",
    },
    { label: "Closed", count: closed, color: "var(--color-green-600)" },
  ];

  const priorityRows = [
    {
      label: "Critical",
      count: stats.critical,
      color: "var(--color-red-500)",
    },
    {
      label: "High",
      count: stats.high,
      color: "var(--color-orange-500)",
    },
    {
      label: "Medium",
      count: stats.medium,
      color: "var(--color-blue-500)",
    },
    {
      label: "Low",
      count: stats.low,
      color: "var(--color-gray-400)",
    },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Dashboard</h1>
        <p>Support tickets at a glance</p>
      </header>

      <section className="dashboard__summary" aria-label="Support overview">
        {summary.map(({ label, value }) => (
          <Card className="dashboard-card" padding="lg" key={label}>
            <span className="dashboard-card__label">{label}</span>
            <strong className="dashboard-card__value">{value}</strong>
          </Card>
        ))}
      </section>

      <Suspense
        fallback={
          <div className="dashboard__state" role="status">
            <Spinner />
          </div>
        }
      >
        <div className="dashboard__charts">
          <DashboardChart
            id="dashboard-status-title"
            title="Tickets by status"
            rows={statusRows}
            total={total}
          />

          <DashboardChart
            id="dashboard-priority-title"
            title="Tickets by priority"
            rows={priorityRows}
            total={total}
          />
        </div>
      </Suspense>
    </div>
  );
}
