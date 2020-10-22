import { Box, Container } from "@material-ui/core";
import { Router } from "@reach/router";
import React, { ReactNode } from "react";
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
          <Router>{children}</Router>
        </Box>
      </Container>
      <Footer />
    </>
  );
};
