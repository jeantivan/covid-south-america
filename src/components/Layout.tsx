import { Box, Container } from "@material-ui/core";
import React, { ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

import { Switch } from "react-router-dom";

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
