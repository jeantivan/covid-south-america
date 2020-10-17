import React, { useState, ReactNode, useContext, createContext } from "react";

const COLOR_MODE_KEY = "color-mode";

function getInitialColorMode() {
  const persistedColorPreference = window.localStorage.getItem(COLOR_MODE_KEY);
  // const hasPersistedPreference = typeof persistedColorPreference === "string";
  // If the user has explicitly chosen light or dark,
  // let's use it. Otherwise, this value will be null.
  if (persistedColorPreference) {
    return persistedColorPreference;
  }
  // If they haven't been explicit, let's check the media
  // query
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const hasMediaQueryPreference = typeof mql.matches === "boolean";
  if (hasMediaQueryPreference) {
    return mql.matches ? "dark" : "light";
  }
  // If they are using a browser/OS that doesn't support
  // color themes, let's default to 'light'.
  return "light";
}

type ColorModeType = {
  colorMode: string;
  setColorMode: (value: string) => void;
  toogleColorMode: () => void;
};

export const ColorModeContext = createContext<ColorModeType>(undefined!);

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [colorMode, rawSetColorMode] = useState(getInitialColorMode);

  const setColorMode = (value: string) => {
    rawSetColorMode(value);
    // Persist it on update
    window.localStorage.setItem(COLOR_MODE_KEY, value);
  };

  const toogleColorMode = () => {
    rawSetColorMode((prevColorMode) => {
      let nextColorMode = prevColorMode === "light" ? "dark" : "light";

      window.localStorage.setItem(COLOR_MODE_KEY, nextColorMode);

      return nextColorMode;
    });
  };

  React.useEffect(() => {
    if (!window.localStorage.getItem(COLOR_MODE_KEY)) {
      window.localStorage.setItem(COLOR_MODE_KEY, colorMode);
    }
  }, []);

  return (
    <ColorModeContext.Provider
      value={{ colorMode, setColorMode, toogleColorMode }}
    >
      {children}
    </ColorModeContext.Provider>
  );
};
