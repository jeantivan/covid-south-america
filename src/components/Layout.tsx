import React, { ReactNode } from "react";
import { Switch } from "react-router-dom";

import { Box, Container } from "@material-ui/core";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container component="main" id="main">
        <Box py={4}>
          <Switch>{children}</Switch>
        </Box>
      </Container>
      <Footer />
    </>
  );
};
