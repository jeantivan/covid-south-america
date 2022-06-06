import React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export const Footer = () => {
  return (
    <Box
      component="footer"
      id="footer"
      py={3}
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography align="center">
              Data from{" "}
              <Link
                href="https://covid19api.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="COVID19 API"
              >
                COVID19 API
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" variant="body2">
              Created by{" "}
              <Link href="https://github.com/jeantivan" title="Jean Tivan">
                Jean Tivan
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
