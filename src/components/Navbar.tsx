import React from "react";
import { Link as RRLink } from "react-router-dom";

import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import GithubIcon from "@mui/icons-material/GitHub";

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
              size="large"
            >
              {colorMode === "light" ? (
                <Brightness4Icon />
              ) : (
                <Brightness7Icon />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Hidden mdDown>
          <Box ml={1}>
            <IconButton
              component="a"
              href="https://github.com/jeantivan/"
              aria-label="Github profile"
              size="large"
            >
              <GithubIcon />
            </IconButton>
          </Box>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
