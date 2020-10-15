import { Box, Grid, Typography } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import React, { useMemo } from "react";
import useSWR from "swr";
import { CountryTable } from "../components/CountryTable";
import { GlobalSummaryResponse } from "../types";
import { computeLASummary, fetcher } from "../utils";
import { Helmet } from "react-helmet";
import { AspectRatioBox } from "../components/AspectRatioBox";
import { ParentSize } from "@visx/responsive";
import { SouthAmericaMap } from "../components/SouthAmericaMap";

export const HomePage = (props: RouteComponentProps) => {
  const { data: globalData } = useSWR<GlobalSummaryResponse>(
    `https://api.covid19api.com/summary`,
    fetcher
  );
  const laSummary = useMemo(() => computeLASummary(globalData), [globalData]);
  return (
    <Box component="section" my={4}>
      <Helmet>
        <title>Covid 19 en Latinoamérica </title>
      </Helmet>
      <Typography variant="h1">Home</Typography>
      <Grid container spacing={2}>
        <Grid item sm={10}>
          <Typography variant="h5" component="h3">
            Casos por país
          </Typography>
        </Grid>
        <Grid item lg={10}>
          <AspectRatioBox ratio={0.65}>
            <Box height="100%">
              <ParentSize>
                {({ width, height }) => (
                  <SouthAmericaMap
                    width={width}
                    height={height}
                    data={laSummary}
                  />
                )}
              </ParentSize>
            </Box>
          </AspectRatioBox>
        </Grid>
        <Grid item lg={8}>
          <CountryTable laSummary={laSummary} />
        </Grid>
      </Grid>
    </Box>
  );
};
