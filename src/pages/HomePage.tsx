import { Box, Grid, Typography } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import React, { useMemo } from "react";
import useSWR from "swr";
import { CountryTable } from "../components/CountryTable";
import { GlobalSummaryResponse } from "../types";
import { computeLASummary, fetcher } from "../utils";

export const HomePage = (props: RouteComponentProps) => {
  const { data: globalData } = useSWR<GlobalSummaryResponse>(
    `https://api.covid19api.com/summary`,
    fetcher
  );
  const laSummary = useMemo(() => computeLASummary(globalData), [globalData]);
  return (
    <Box component="section" my={4}>
      <Typography variant="h1">Home</Typography>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Typography variant="h5" component="h3">
            Casos por país
          </Typography>
        </Grid>
        <Grid item lg={8}>
          <CountryTable laSummary={laSummary} />
        </Grid>
      </Grid>
    </Box>
  );
};
