import { Link } from "react-router-dom";
import { ALGORITHMS } from "@/content/reference";
import { getModule } from "@/content";

export default function AlgorithmsPage() {
  return (
    <div>
      <h1 className="text-3xl grad-text mb-1">Algorithm deep-dives</h1>
      <p className="text-muted mb-8">
        The strategies that power the concepts — browsable on their own. System design is applied algorithms at scale.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {ALGORITHMS.map((a) => {
          const linked = getModule(a.id); // some algorithms map to a full module
          const inner = (
            <div className="panel p-4 h-full hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-semibold">{a.name}</h3>
                {linked && <span className="chip" style={{ color: "#6bf0c8", borderColor: "#6bf0c8" }}>interactive</span>}
              </div>
              <p className="text-sm mb-2">{a.gist}</p>
              <p className="text-xs text-muted"><span className="uppercase tracking-wider">Used in:</span> {a.usedIn}</p>
            </div>
          );
          return linked ? (
            <Link key={a.id} to={`/learn/${a.id}`}>{inner}</Link>
          ) : (
            <div key={a.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
