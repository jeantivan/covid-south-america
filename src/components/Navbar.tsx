import {
  AppBar,
  Box,
  Hidden,
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
import { Link as RRLink } from "react-router-dom";
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
    <AppBar
      id="header"
      position="static"
      color={colorMode === "light" ? "primary" : "inherit"}
      elevation={0}
    >
      <Toolbar>
        <Typography variant="h6" component="h1" className={classes.title}>
          <Link color="inherit" component={RRLink} to="/">
            Covid-19 in South America
          </Link>
        </Typography>
        <Box>
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
        <Hidden smDown>
          <Box ml={1}>
            <IconButton
              component="a"
              href="https://github.com/jptivan53/"
              aria-label="Github profile"
            >
              <GithubIcon />
            </IconButton>
          </Box>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
