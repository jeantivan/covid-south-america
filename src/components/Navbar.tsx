import { IconButton, AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GithubIcon from "@material-ui/icons/GitHub";

import React from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const Navbar: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="h1" className={classes.title}>
          Covid-19 Latinoamerica
        </Typography>
        <IconButton aria-label="Github profile">
          <GithubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
