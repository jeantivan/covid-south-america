import {
  createMuiTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core";
import React from "react";
import { useColorMode } from "./components/ColorMode";
import { Layout } from "./components/Layout";
import { CountryPage } from "./pages/CountryPage";
import { HomePage } from "./pages/HomePage";
import orange from "@material-ui/core/colors/orange";

function App() {
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
        <CountryPage path="/country/:country" />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
