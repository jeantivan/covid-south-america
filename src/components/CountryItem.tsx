import React from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { FLAG_PREFIX } from "../constants";
import { SummaryCountryResponse } from "../types";

export const CountryItem = ({
  Country,
  Slug,
  TotalConfirmed,
  //TotalRecovered,
  TotalDeaths,
}: SummaryCountryResponse) => {
  return (
    <Paper
      variant="outlined"
      sx={(theme: any) => ({
        borderWidth: 2,
        cursor: "pointer",
        p: 1,

        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[3],
        },
      })}
    >
      <Box
        component={Link}
        to={`/country/${Slug}`}
        sx={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs="auto">
            <Box
              component="img"
              src={`${FLAG_PREFIX}${Slug}.png`}
              alt={`Bandera de ${Country}`}
              sx={{
                borderRadius: 0.5,
                width: 48,
                objectFit: "cover",
              }}
            />
          </Grid>

          <Grid item xs zeroMinWidth>
            <Typography component="div" variant="h6" noWrap>
              {Country}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="body2" color="info.main">
              Confirmed
            </Typography>
            <Typography fontWeight={700}>
              {TotalConfirmed.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="error.main">
              Deaths
            </Typography>
            <Typography fontWeight={700}>
              {TotalDeaths.toLocaleString()}
            </Typography>
          </Grid>
          {/* <Grid item xs={4}>
            <Typography variant="body2" color="success.main">
              Recovered
            </Typography>
            <Typography fontWeight={700}>
              {TotalRecovered.toLocaleString()}
            </Typography>
          </Grid> */}
        </Grid>
      </Box>
    </Paper>
  );
};
