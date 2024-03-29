import React from "react";
import { Link } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

import { Seo } from "../components/Seo";

export const Error404Page = () => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Seo title="Error 404: This page could not be found" />
      <Box>
        <Typography variant="h2">ERROR 404</Typography>
        <Typography variant="h5" component="p">
          This page could not be found.
        </Typography>
        <Box mt={4}>
          <Button variant="contained" color="primary" component={Link} to="/">
            Go to home page
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
