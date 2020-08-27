import React, { PropsWithChildren } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(),
  },
}));

function Main({ children }: PropsWithChildren<{}>) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

export default Main;
