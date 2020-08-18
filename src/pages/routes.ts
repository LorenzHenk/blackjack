export enum Routes {
  Home = "Home",
  PracticeBasicCounting = "PracticeBasicCounting",
}

const routeToUrlMapping: Record<Routes, string> = {
  [Routes.Home]: "/",
  [Routes.PracticeBasicCounting]: "/practice/counting-basic",
};

export function getUrl(route: Routes): string {
  return routeToUrlMapping[route];
}
