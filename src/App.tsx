import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import "fontsource-roboto";

import { getRouteComponent } from "./pages/mapping";
import { Routes, getUrl } from "./pages/routes";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import Main from "./containers/Main";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#086788",
    },
    secondary: { main: "#F0C808" },
    background: {
      default: "#dfd",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "html, body, #root": {
          height: "100%",
          overflow: "hidden",
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
        <Main>
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
        </Main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
