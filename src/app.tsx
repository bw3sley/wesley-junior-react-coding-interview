import { useCallback, useEffect, useState } from "react";
import { TopBar } from "./components/layout/topBar";
import { Sidebar, type Screen } from "./components/layout/sidebar";
import { TicketList } from "./components/ticketList";
import { AgentList } from "./components/agentList";
import { AssignScreen } from "./components/assignScreen";
import { DashboardScreen } from "./components/dashboardScreen";
import type { SupportCase } from "./types/supportCase";
import "./components/layout/appShell.css";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsSidebarOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  const handleSelectCase = useCallback((supportCase: SupportCase) => {
    setSelectedCase(supportCase);
  }, []);

  const handleBack = useCallback(() => setSelectedCase(null), []);

  function handleNavigate(screen: Screen) {
    setSelectedCase(null);
    setActiveScreen(screen);
    setIsSidebarOpen(false);
  }

  function renderMain() {
    if (activeScreen === "dashboard") {
      return <DashboardScreen />;
    }

    if (activeScreen === "tickets") {
      if (selectedCase) {
        return <AssignScreen supportCase={selectedCase} onBack={handleBack} />;
      }
      return <TicketList onSelectCase={handleSelectCase} />;
    }

    if (activeScreen === "agents") {
      return <AgentList />;
    }

    return null;
  }

  return (
    <div className="app-shell">
      <TopBar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <div className="app-shell__body">
        {isSidebarOpen && (
          <button
            className="app-shell__sidebar-backdrop"
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <Sidebar activeScreen={activeScreen} onNavigate={handleNavigate} isOpen={isSidebarOpen} />
        <main className="app-shell__main">{renderMain()}</main>
      </div>
    </div>
  );
}
