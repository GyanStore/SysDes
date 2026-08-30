import { NavLink, Outlet, Link } from "react-router-dom";
import { useProgress } from "@/lib/progress";
import { dueCards } from "@/lib/srs";
import SpaceBackground from "@/components/space/SpaceBackground";

const LINKS = [
  { to: "/dojo", label: "Mission Map" },
  { to: "/algorithms", label: "Algorithms" },
  { to: "/practice", label: "Practice" },
  { to: "/deck", label: "Deck" },
  { to: "/reference", label: "Reference" },
];

export default function AppShell() {
  const { state } = useProgress();
  const due = dueCards(state.deck).length;

  return (
    <>
    <SpaceBackground />
    <div className="relative z-10 min-h-full flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[rgba(6,10,22,0.72)] border-b border-line">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg">🛰️</span>
            <span className="font-bold tracking-tight grad-text hidden sm:inline">Mission Control</span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto flex-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    isActive ? "text-ink bg-[#12224a]" : "text-muted hover:text-ink"
                  }`
                }
              >
                {l.label}
                {l.to === "/deck" && due > 0 && (
                  <span className="ml-1.5 chip !px-1.5 !py-0" style={{ color: "#ffcf6e", borderColor: "#ffcf6e" }}>{due}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <span className="readout text-sm" title="Experience points">✦ {state.xp}</span>
            <span className="readout text-sm" title="Day streak" style={{ color: "#ffcf6e" }}>🔥 {state.streak.count}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-line mt-8">
        <div className="max-w-6xl mx-auto px-4 py-5 text-xs text-muted flex items-center justify-between flex-wrap gap-2">
          <span>Mission Control · learn system design by watching it breathe, break & heal.</span>
          <span className="readout">local-first · your progress stays in this browser</span>
        </div>
      </footer>
    </div>
    </>
  );
}
