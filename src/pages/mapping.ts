import { Routes } from "./routes";
import { Home } from "./Home";
import { PracticeBasicCounting } from "./PracticeBasicCounting";

const routeToComponentMapping: Record<Routes, React.ComponentType> = {
  [Routes.Home]: Home,
  [Routes.PracticeBasicCounting]: PracticeBasicCounting,
};

export function getRouteComponent(route: Routes): React.ComponentType {
  return routeToComponentMapping[route];
}
