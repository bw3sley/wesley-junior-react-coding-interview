import { BarChart3, Inbox, UsersRound } from "lucide-react";
import "./sidebar.css";

export type Screen = "dashboard" | "tickets" | "agents";

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems = [
  { icon: BarChart3, label: "Dashboard", screen: "dashboard" as Screen },
  { icon: Inbox, label: "Tickets", screen: "tickets" as Screen },
  { icon: UsersRound, label: "Agents", screen: "agents" as Screen },
];

export function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {navItems.map((item) => {
            const isActive = activeScreen === item.screen;
            return (
              <li key={item.screen}>
                <a
                  href="#"
                  className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.screen);
                  }}
                >
                  <item.icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
