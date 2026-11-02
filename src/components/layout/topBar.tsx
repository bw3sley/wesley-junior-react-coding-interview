import { Menu, X } from "lucide-react";
import "./topBar.css";

interface TopBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ isSidebarOpen, onToggleSidebar }: TopBarProps) {
  return (
    <header className="top-bar">
      <button
        className="top-bar__sidebar-toggle"
        type="button"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-controls="mobile-sidebar"
        aria-expanded={isSidebarOpen}
        onClick={onToggleSidebar}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="top-bar__logo">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
        <span className="top-bar__title">SupportHub</span>
      </div>
    </header>
  );
}
