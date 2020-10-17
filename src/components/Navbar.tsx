import {
  AppBar,
  Box,
  IconButton,
  Link,
  makeStyles,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import GithubIcon from "@material-ui/icons/GitHub";
import { Link as ReachLink } from "@reach/router";
import React from "react";
import { useColorMode } from "./ColorMode";

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

  const { colorMode, toogleColorMode } = useColorMode();

  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="h1" className={classes.title}>
          <Link color="inherit" component={ReachLink} to="/">
            Covid-19 Latinoamerica
          </Link>
        </Typography>
        <Box mr={2}>
          <Tooltip title="Toogle color mode" placement="bottom" arrow>
            <IconButton
              onClick={() => {
                toogleColorMode();
              }}
              aria-label="Toogle color mode"
            >
              {colorMode === "light" ? (
                <Brightness4Icon />
              ) : (
                <Brightness7Icon />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <IconButton
            component="a"
            href="https://github.com/jptivan53/covid-latam"
            aria-label="Github profile"
          >
            <GithubIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
