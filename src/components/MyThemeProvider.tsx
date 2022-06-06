import React, {
  useState,
  ReactNode,
  useContext,
  createContext,
  useEffect,
  useMemo,
} from "react";
import { ColorModeOptions } from "../types";
import { COLOR_MODE_KEY, getInitialColorMode } from "../utils";

import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { orange } from "@mui/material/colors";

interface ColorModeContext {
  mode: ColorModeOptions;
  toggleColorMode: () => void;
}

const ColorMode = createContext({} as ColorModeContext);

export const useColorMode = () => useContext(ColorMode);

export const MyThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, rawSetColorMode] = useState<"light" | "dark">(
    getInitialColorMode
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        rawSetColorMode((prevColorMode) => {
          let nextColorMode: ColorModeOptions =
            prevColorMode === "light" ? "dark" : "light";

          window.localStorage.setItem(COLOR_MODE_KEY, nextColorMode);

          return nextColorMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode,
            primary: orange,
            background: {
              paper: mode === "light" ? "#fafafa" : "#424242",
            },
          },
        })
      ),
    [mode]
  );

  console.log(theme);

  useEffect(() => {
    if (!window.localStorage.getItem(COLOR_MODE_KEY)) {
      window.localStorage.setItem(COLOR_MODE_KEY, mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ColorMode.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorMode.Provider>
  );
};
