import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import "fontsource-roboto";

import { getRouteComponent } from "./pages/mapping";
import { Routes, getUrl } from "./pages/routes";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#086788",
    },
    secondary: { main: "#F0C808" },
    background: {
      default: "#D7EAD7",
      paper: "#076324",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "html, body, #root": {
          height: "100%",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          {Object.keys(Routes).map((routeKey) => {
            const route = Routes[(routeKey as any) as keyof typeof Routes];
            const RouteComponent = getRouteComponent(route);
            return (
              <Route exact key={route} path={getUrl(route)}>
                <RouteComponent />
              </Route>
            );
          })}
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
