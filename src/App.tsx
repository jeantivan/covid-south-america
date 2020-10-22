import {
  createMuiTheme,
  CssBaseline,
  makeStyles,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core";
import React from "react";
import { useColorMode } from "./components/ColorMode";
import { Layout } from "./components/Layout";
import { CountryPage } from "./pages/CountryPage";
import { HomePage } from "./pages/HomePage";
import orange from "@material-ui/core/colors/orange";
import { Error404Page } from "./pages/Error404Page";

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
    <ThemeProvider
      theme={responsiveFontSizes(
        createMuiTheme({
          palette: {
            type: colorMode === "light" ? "light" : "dark",
            primary: orange,
          },
        })
      )}
    >
      <CssBaseline />
      <Layout>
        <HomePage path="/" />
        <Error404Page path="404" />
        <CountryPage path="country/:country" />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
