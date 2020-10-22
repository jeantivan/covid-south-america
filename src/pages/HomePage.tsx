import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import MapIcon from "@material-ui/icons/Map";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import { Skeleton } from "@material-ui/lab";
import { RouteComponentProps } from "@reach/router";
import { ParentSize } from "@visx/responsive";
import { timeFormat } from "d3-time-format";
import React, { useState } from "react";
import useSWR from "swr";
import { AspectRatioBox } from "../components/AspectRatioBox";
import { CountryItem } from "../components/CountryItem";
import { Seo } from "../components/Seo";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [viewMap, setViewMap] = useState(true);
  const { data: globalData } = useSWR<GlobalSummaryResponse>(
    `https://api.covid19api.com/summary`,
    fetcher
  );
  const laSummary = computeLASummary(globalData);

  return (
    <Box component="section">
      <Seo title="Home" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h2">
            Cases in South America
          </Typography>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Grid container spacing={2}>
            <Grid item xs>
              <Typography variant="h5" component="h3">
                Summary
              </Typography>
            </Grid>
            <Grid item xs={12} sm lg={12}>
              <Typography
                variant="h5"
                component="h4"
                className={classes.confirmed}
              >
                Confirmed
              </Typography>
              <Typography variant="h3" component="p" className={classes.result}>
                {laSummary ? (
                  laSummary.Summary.TotalConfirmed.toLocaleString()
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm lg={12}>
              <Typography
                variant="h5"
                component="h4"
                className={classes.recovered}
              >
                Recovered
              </Typography>
              <Typography variant="h3" component="p" className={classes.result}>
                {laSummary ? (
                  laSummary.Summary.TotalRecovered.toLocaleString()
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm lg={12}>
              <Typography
                variant="h5"
                component="h4"
                className={classes.deaths}
              >
                Deaths
              </Typography>
              <Typography variant="h3" component="p" className={classes.result}>
                {laSummary ? (
                  laSummary.Summary.TotalDeaths.toLocaleString()
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Grid>
            {!laSummary ? null : (
              <Grid item xs={12}>
                <Typography color="textSecondary">
                  Last update:{" "}
                  {timeFormat("%b %d, '%Y")(new Date(laSummary.Date))}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Grid container spacing={2}>
            <Grid item xs>
              <Typography variant="h5" component="h3">
                Countries
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <Tooltip
                title={viewMap ? "See country list" : "See map"}
                placement="top"
                arrow
              >
                <IconButton
                  aria-label={viewMap ? "See country list" : "See map"}
                  onClick={() => {
                    setViewMap((state) => !state);
                  }}
                >
                  {viewMap ? <ViewModuleIcon /> : <MapIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {viewMap ? (
              <AspectRatioBox ratio={isMobile ? 1 : 0.65}>
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
                    {Array.from({ length: 6 }, (_, i) => (
                      <Grid item xs={12} md={4} key={`skeleton-${i}`}>
                        <Skeleton variant="rect" height="80px" />
                      </Grid>
                    ))}
                  </>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
