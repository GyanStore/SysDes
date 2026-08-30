import { useParams, Link } from "react-router-dom";
import { getModule } from "@/content";
import ModulePage from "@/components/module/ModulePage";

export default function ModuleRoute() {
  const { moduleId } = useParams();
  const module = moduleId ? getModule(moduleId) : undefined;

  if (!module) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">🛰️</div>
        <h1 className="text-xl mb-2">Module not found</h1>
        <p className="text-muted mb-6">That system isn't on the map.</p>
        <Link to="/dojo" className="btn btn-primary">← Back to Mission Map</Link>
      </div>
    );
  }
  return <ModulePage module={module} />;
}
