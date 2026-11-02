import { useEffect, useState } from "react";
import { agents } from "@/data/agents";
import { fetchCases } from "@/data/mockApi";
import type { SupportCase } from "@/types/supportCase";
import { DashboardChart } from "./dashboardChart";
import { Card } from "./ui/card";
import { Spinner } from "./ui/spinner";

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

  const total = cases.length;
  const open = cases.filter(
    (supportCase) => supportCase.status === "open",
  ).length;
  const inProgress = cases.filter(
    (supportCase) => supportCase.status === "in-progress",
  ).length;
  const closed = cases.filter(
    (supportCase) => supportCase.status === "closed",
  ).length;
  const now = new Date();
  const overdue = cases.filter(
    (supportCase) =>
      supportCase.status !== "closed" && supportCase.deadline < now,
  ).length;

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
      count: cases.filter((item) => item.priority === "critical").length,
      color: "var(--color-red-500)",
    },
    {
      label: "High",
      count: cases.filter((item) => item.priority === "high").length,
      color: "var(--color-orange-500)",
    },
    {
      label: "Medium",
      count: cases.filter((item) => item.priority === "medium").length,
      color: "var(--color-blue-500)",
    },
    {
      label: "Low",
      count: cases.filter((item) => item.priority === "low").length,
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
    </div>
  );
}
