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

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import GithubIcon from "@mui/icons-material/GitHub";

import { useColorMode } from "./MyThemeProvider";

export const Navbar: React.FC = () => {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <AppBar id="header" position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flex: 1 }}>
          <Link color="inherit" component={RRLink} to="/">
            Covid-19 in South America
          </Link>
        </Typography>
        <Box>
          <Tooltip title="Toogle color mode" placement="bottom" arrow>
            <IconButton
              onClick={() => {
                toggleColorMode();
              }}
              aria-label="Toogle color mode"
              size="large"
            >
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
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
