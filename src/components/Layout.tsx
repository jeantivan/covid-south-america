import { Container, Box } from "@material-ui/core";
import React, { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Router } from "@reach/router";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container component="main">
        <Box py={4}>
          <Router>{children}</Router>
        </Box>
      </Container>
    </>
  );
};
