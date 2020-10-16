import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import MapIcon from "@material-ui/icons/Map";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import { Skeleton } from "@material-ui/lab";
import { RouteComponentProps } from "@reach/router";
import { ParentSize } from "@visx/responsive";
import { timeFormat } from "d3-time-format";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import useSWR from "swr";
import { AspectRatioBox } from "../components/AspectRatioBox";
import { CountryItem } from "../components/CountryItem";
import { SouthAmericaMap } from "../components/SouthAmericaMap";
import { GlobalSummaryResponse } from "../types";
import { computeLASummary, fetcher } from "../utils";

const useStyles = makeStyles((theme) => ({
  confirmed: {
    color: theme.palette.info.main,
  },
  recovered: {
    color: theme.palette.success.main,
  },
  deaths: {
    color: theme.palette.error.main,
  },
  result: {
    fontWeight: 700,
  },
}));

export const HomePage = (props: RouteComponentProps) => {
  const classes = useStyles();

  const [viewMap, setViewMap] = useState(true);
  const { data: globalData } = useSWR<GlobalSummaryResponse>(
    `https://api.covid19api.com/summary`,
    fetcher
  );
  //const laSummary = useMemo(() => computeLASummary(globalData), [globalData]);
  const laSummary = computeLASummary(globalData);

  return (
    <Box component="section">
      <Helmet>
        <title>Covid 19 en Latinoamérica </title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          <Box mb={2} minHeight={48}>
            <Typography variant="h5" component="h3">
              Summary
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h5" className={classes.confirmed}>
              Confirmed
            </Typography>
            <Typography variant="h3" component="p" className={classes.result}>
              {laSummary ? (
                laSummary.Summary.TotalConfirmed.toLocaleString()
              ) : (
                <Skeleton />
              )}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h5" className={classes.recovered}>
              Recovered
            </Typography>
            <Typography variant="h3" component="p" className={classes.result}>
              {laSummary ? (
                laSummary.Summary.TotalRecovered.toLocaleString()
              ) : (
                <Skeleton />
              )}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h5" className={classes.deaths}>
              Deaths
            </Typography>
            <Typography variant="h3" component="p" className={classes.result}>
              {laSummary ? (
                laSummary.Summary.TotalDeaths.toLocaleString()
              ) : (
                <Skeleton />
              )}
            </Typography>
          </Box>
          {!laSummary ? null : (
            <Box>
              <Typography color="textSecondary">
                Last update:{" "}
                {timeFormat("%b %d, '%Y")(new Date(laSummary.Date))}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} lg={9}>
          <Box mb={2} display="flex">
            <Box flex={1}>
              <Typography variant="h5" component="h3">
                Countries
              </Typography>
            </Box>
            <Box>
              <IconButton
                aria-label={viewMap ? "See map" : "See country list"}
                onClick={() => {
                  setViewMap((state) => !state);
                }}
              >
                {viewMap ? <MapIcon /> : <ViewModuleIcon />}
              </IconButton>
            </Box>
          </Box>
          <Box>
            {viewMap ? (
              <AspectRatioBox ratio={0.65}>
                <Box height="100%">
                  {!laSummary ? (
                    <Skeleton variant="rect" width="100%" height="100%" />
                  ) : (
                    <ParentSize>
                      {({ width, height }) => (
                        <SouthAmericaMap
                          width={width}
                          height={height}
                          dataCountries={laSummary.Countries}
                        />
                      )}
                    </ParentSize>
                  )}
                </Box>
              </AspectRatioBox>
            ) : (
              <Grid container spacing={2}>
                {laSummary ? (
                  laSummary.Countries.map((country) => (
                    <Grid item xs={12} sm={6} md={4} key={country.Slug}>
                      <CountryItem {...country} />
                    </Grid>
                  ))
                ) : (
                  <>
                    <Grid item xs={12} md={4}>
                      <Skeleton variant="rect" height="80px" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Skeleton variant="rect" height="80px" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Skeleton variant="rect" height="80px" />
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
