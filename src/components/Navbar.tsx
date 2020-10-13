import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GithubIcon from "@material-ui/icons/GitHub";
import { Link as ReachLink } from "@reach/router";

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
          <Link color="inherit" component={ReachLink} to="/">
            Covid-19 Latinoamerica
          </Link>
        </Typography>

        <IconButton
          component="a"
          href="https://github.com/jptivan53/covid-latam"
          aria-label="Github profile"
        >
          <GithubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
