import React, { ReactNode } from "react";
import { Routes } from "react-router-dom";

import { Box, Container, GlobalStyles } from "@mui/material";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { MyThemeProvider } from "./MyThemeProvider";

const globalStyles = {
  "html, body": {
    width: "100%",
    height: "100%",
  },
  "#root": {
    height: "100%",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto 1fr auto",
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
};

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <MyThemeProvider>
      <GlobalStyles styles={globalStyles} />
      <Navbar />
      <Container component="main" id="main">
        <Box py={4}>
          <Routes>{children}</Routes>
        </Box>
      </Container>
      <Footer />
    </MyThemeProvider>
  );
};
