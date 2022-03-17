import React from "react";
import { Route } from "react-router-dom";
import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
  adaptV4Theme,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { CountryPage } from "./pages/CountryPage";

import { HomePage } from "./pages/HomePage";
import { Error404Page } from "./pages/Error404Page";
import { Layout } from "./components/Layout";

import { useColorMode } from "./components/ColorMode";
import { orange } from '@mui/material/colors';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const useStyles = makeStyles({
  "@global": {
    "html, body": {
      width: "100%",
      height: "100%",
    },
    "#root": {
      height: "100%",
      display: "grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto 1fr auto",
      gap: "0px 0px",
      gridTemplateAreas: `
        "header"
        "main"
        "footer"
      `,
    },
    "#header": {
      gridArea: "header",
    },
    "#main": {
      gridArea: "main",
    },
    "#footer": {
      gridArea: "footer",
    },
  },
});

function App() {
  useStyles();
  const { colorMode } = useColorMode();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider
        theme={responsiveFontSizes(
          createTheme(adaptV4Theme({
            palette: {
              mode: colorMode === "light" ? "light" : "dark",
              primary: orange,
            },
          }))
        )}
      >
        <CssBaseline />
        <Layout>
          <Route path="/404" component={Error404Page} />
          <Route path="/country/:country" component={CountryPage} />
          <Route path="/" component={HomePage} />
        </Layout>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
