import { createHashRouter } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Landing from "@/pages/Landing";
import MissionMap from "@/pages/MissionMap";
import ModuleRoute from "@/pages/ModuleRoute";
import AlgorithmsPage from "@/pages/AlgorithmsPage";
import PracticePage from "@/pages/PracticePage";
import DeckPage from "@/pages/DeckPage";
import ReferencePage from "@/pages/ReferencePage";

// HashRouter keeps the app working when served from any static host or subpath
// (no server-side history fallback required).
export const router = createHashRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Landing /> },
      { path: "dojo", element: <MissionMap /> },
      { path: "learn/:moduleId", element: <ModuleRoute /> },
      { path: "algorithms", element: <AlgorithmsPage /> },
      { path: "practice", element: <PracticePage /> },
      { path: "deck", element: <DeckPage /> },
      { path: "reference", element: <ReferencePage /> },
      { path: "*", element: <ModuleRoute /> },
    ],
  },
]);
