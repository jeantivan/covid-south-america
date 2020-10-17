import {
  createMuiTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core";
import React from "react";
import { useColorMode } from "./components/DarkMode";
import { Layout } from "./components/Layout";
import { CountryPage } from "./pages/CountryPage";
import { HomePage } from "./pages/HomePage";

// const themeLight = responsiveFontSizes(
//   createMuiTheme({
//     palette: {
//       type: "light",
//     },
//   })
// );

// const themeDark = responsiveFontSizes(
//   createMuiTheme({
//     palette: {
//       type: "dark",
//     },
//   })
// );

function App() {
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    console.log({ colorMode });
  }, [colorMode]);

  return (
    <ThemeProvider
      theme={responsiveFontSizes(
        createMuiTheme({
          palette: {
            type: colorMode === "light" ? "light" : "dark",
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
