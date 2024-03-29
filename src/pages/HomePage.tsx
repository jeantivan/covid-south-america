import React, { useState } from "react";
import useSWR from "swr";

import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Skeleton,
} from "@mui/material";
import { Theme } from "@mui/material/styles";

import MapIcon from "@mui/icons-material/Map";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { ParentSize } from "@visx/responsive";
import { timeFormat } from "d3-time-format";

import { AspectRatioBox } from "../components/AspectRatioBox";
import { CountryItem } from "../components/CountryItem";
import { Seo } from "../components/Seo";
import { SouthAmericaMap } from "../components/SouthAmericaMap";

import { GlobalSummaryResponse } from "../types";
import { computeLASummary, fetcher } from "../utils";

export const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [viewMap, setViewMap] = useState<boolean>(true);
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
            Number of cases in South America
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
                sx={{
                  color: (theme: Theme) => theme.palette.info.main,
                }}
              >
                Confirmed
              </Typography>
              <Typography variant="h3" component="p" fontWeight={700}>
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
                sx={{
                  color: (theme: Theme) => theme.palette.error.main,
                }}
              >
                Deaths
              </Typography>
              <Typography variant="h3" component="p" fontWeight={700}>
                {laSummary ? (
                  laSummary.Summary.TotalDeaths.toLocaleString()
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Grid>
            {/*  <Grid item xs={12} sm lg={12}>
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  color: (theme: Theme) => theme.palette.success.main,
                }}
              >
                Recovered
              </Typography>
              <Typography variant="h3" component="p" fontWeight={700}>
                {laSummary ? (
                  laSummary.Summary.TotalRecovered.toLocaleString()
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Grid> */}

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
                    setViewMap((state: boolean) => !state);
                  }}
                  size="large"
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
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <ParentSize>
                      {({
                        width,
                        height,
                      }: {
                        width: number;
                        height: number;
                      }) => (
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
                        <Skeleton variant="rectangular" height="80px" />
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
