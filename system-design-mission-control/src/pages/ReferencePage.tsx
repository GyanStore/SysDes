import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GLOSSARY } from "@/content/reference";
import { ALL_MODULES } from "@/content";

const NINES = [
  ["90%", "36.5 days", "3.65 days"],
  ["99%", "3.65 days", "7.2 hours"],
  ["99.9%", "8.76 hours", "43.2 min"],
  ["99.99%", "52.6 min", "4.32 min"],
  ["99.999%", "5.26 min", "25.9 sec"],
];

const NUMBERS = [
  ["L1 cache", "~1 ns"],
  ["Main memory (RAM)", "~100 ns"],
  ["SSD random read", "~16 µs"],
  ["Datacenter round trip", "~500 µs"],
  ["Cross-continent RTT", "~150 ms"],
  ["Seconds in a day", "86,400"],
];

export default function ReferencePage() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const glossary = useMemo(
    () =>
      query
        ? GLOSSARY.filter((g) => (g.term + g.definition + (g.analogy ?? "")).toLowerCase().includes(query))
        : GLOSSARY,
    [query],
  );

  const modules = useMemo(
    () =>
      query
        ? ALL_MODULES.filter((m) => (m.title + m.tagline + m.tags.join(" ")).toLowerCase().includes(query)).slice(0, 8)
        : [],
    [query],
  );

  return (
    <div>
      <h1 className="text-3xl grad-text mb-1">Reference</h1>
      <p className="text-muted mb-6">Numbers, trade-offs, and a glossary — every term with a one-line analogy.</p>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search terms, concepts, modules…"
        className="w-full bg-[#0a1130] border border-line rounded-xl px-4 py-3 text-ink mb-8 focus:border-accent"
        aria-label="Search reference"
      />

      {modules.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg mb-3">Matching modules</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {modules.map((m) => (
              <Link key={m.id} to={`/learn/${m.id}`} className="panel p-3 hover:-translate-y-0.5 transition-transform">
                <div className="font-medium text-sm">{m.title}</div>
                <div className="text-muted text-xs">{m.tagline}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!query && (
        <section className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="panel p-4">
            <h2 className="text-lg mb-3">Latency & capacity numbers</h2>
            <table className="w-full text-sm">
              <tbody>
                {NUMBERS.map((r) => (
                  <tr key={r[0]} className="border-b border-line last:border-0">
                    <td className="py-1.5 text-muted">{r[0]}</td>
                    <td className="py-1.5 readout text-right" style={{ color: "#5eb0ff" }}>{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel p-4">
            <h2 className="text-lg mb-3">The "nines" of availability</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-xs">
                  <th className="text-left font-normal pb-2">Uptime</th>
                  <th className="text-right font-normal pb-2">Down/yr</th>
                  <th className="text-right font-normal pb-2">Down/mo</th>
                </tr>
              </thead>
              <tbody>
                {NINES.map((r) => (
                  <tr key={r[0]} className="border-b border-line last:border-0">
                    <td className="py-1.5 readout" style={{ color: "#6bf0c8" }}>{r[0]}</td>
                    <td className="py-1.5 text-right text-muted">{r[1]}</td>
                    <td className="py-1.5 text-right text-muted">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg mb-3">Glossary {query && <span className="text-muted text-sm">({glossary.length})</span>}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {glossary.map((g) => (
            <div key={g.term} className="panel p-4">
              <div className="font-semibold" style={{ color: "#5eb0ff" }}>{g.term}</div>
              <p className="text-sm mt-1">{g.definition}</p>
              {g.analogy && <p className="text-muted text-xs mt-2">💡 {g.analogy}</p>}
            </div>
          ))}
          {glossary.length === 0 && <p className="text-muted text-sm">No matches. Try another term.</p>}
        </div>
      </section>
    </div>
  );
}
