import React from "react";
import useSWR from "swr";
import { Link, Navigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  Skeleton,
} from "@mui/material";

import { ParentSize } from "@visx/responsive";

import { timeFormat } from "d3-time-format";

import { AspectRatioBox } from "../components/AspectRatioBox";
import { CasesChart } from "../components/CasesChart";
import { Seo } from "../components/Seo";

import { FLAG_PREFIX } from "../constants";
import { CountryResponse } from "../types";
import { fetcher, getCountryNameBySlug } from "../utils";

export const CountryPage = () => {
  const { country } = useParams<{ country: string }>();

  const countryName = getCountryNameBySlug(country);
  //const classes = useStyles();
  const theme = useTheme();

  console.log(theme);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, error } = useSWR<CountryResponse[]>(
    `https://api.covid19api.com/dayone/country/${country}`,
    fetcher
  );

  if (!countryName) {
    return <Navigate to="/404" />;
  }

  const lastUpdate = data ? data[data?.length - 1] : ({} as CountryResponse);
  return (
    <Box>
      <Seo title={`Cases in: ${countryName}`} />

      <Box
        display="flex"
        alignItems="center"
        mb={4}
        component="section"
        id="title-section"
      >
        <Box
          sx={{
            mr: { xs: 2, sm: 4 },
          }}
        >
          <Box
            component="img"
            sx={{
              borderRadius: 0.5,
              width: { xs: 64, sm: 80 },
              objectFit: "cover",
            }}
            src={`${FLAG_PREFIX}${country}.png`}
            alt={`Bandera de ${country}`}
          />
        </Box>
        <Box flex={1}>
          <Typography variant="h4" component="h2" noWrap>
            {countryName}
          </Typography>
        </Box>
      </Box>

      {!error ? (
        <>
          <Box component="section" id="general-summary-section" mb={3}>
            <Grid container spacing={4}>
              <Grid xs={12} item container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="h3">
                    General summary
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="h6" color="info.main">
                    Confirmed
                  </Typography>
                  <Typography variant="h4" component="p" fontWeight={700}>
                    {data ? (
                      lastUpdate.Confirmed.toLocaleString()
                    ) : (
                      <Skeleton />
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Typography variant="h6" color="error.main">
                    Deaths
                  </Typography>
                  <Typography variant="h4" component="p" fontWeight={700}>
                    {data ? lastUpdate.Deaths.toLocaleString() : <Skeleton />}
                  </Typography>
                </Grid>
                {/* <Grid item xs={12} sm>
                  <Typography variant="h6" color="success.main">
                    Recovered
                  </Typography>
                  <Typography variant="h4" component="p" fontWeight={700}>
                    {data ? (
                      lastUpdate.Recovered.toLocaleString()
                    ) : (
                      <Skeleton />
                    )}
                  </Typography>
                </Grid> */}

                {data ? (
                  <Grid item xs={12}>
                    <Typography color="textSecondary">
                      Last update:{" "}
                      {timeFormat("%b %d, '%Y")(new Date(lastUpdate.Date))}
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Box>
          <Box component="section" id="chart-section">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h3">
                      Confirmed cases
                    </Typography>
                  </Grid>
                  <Grid xs={12} item>
                    <AspectRatioBox ratio={isMobile ? 3 / 4 : 9 / 21}>
                      {!data ? (
                        <Skeleton variant="rectangular" height="100%" />
                      ) : (
                        <Box height="100%">
                          <ParentSize>
                            {({ width, height }) => (
                              <CasesChart
                                width={width}
                                height={height}
                                data={data}
                                dataKey={"Confirmed"}
                              />
                            )}
                          </ParentSize>
                        </Box>
                      )}
                    </AspectRatioBox>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h3">
                      Deaths cases
                    </Typography>
                  </Grid>
                  <Grid xs={12} item>
                    <AspectRatioBox ratio={isMobile ? 3 / 4 : 9 / 21}>
                      {!data ? (
                        <Skeleton variant="rectangular" height="100%" />
                      ) : (
                        <Box height="100%">
                          <ParentSize>
                            {({ width, height }) => (
                              <CasesChart
                                width={width}
                                height={height}
                                data={data}
                                dataKey={"Deaths"}
                              />
                            )}
                          </ParentSize>
                        </Box>
                      )}
                    </AspectRatioBox>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h3">
                      Recovered cases
                    </Typography>
                  </Grid>
                  <Grid xs={12} item>
                    <AspectRatioBox ratio={isMobile ? 3 / 4 : 9 / 21}>
                      {!data ? (
                        <Skeleton variant="rectangular" height="100%" />
                      ) : (
                        <Box height="100%">
                          <ParentSize>
                            {({ width, height }) => (
                              <CasesChart
                                width={width}
                                height={height}
                                data={data}
                                dataKey={"Recovered"}
                              />
                            )}
                          </ParentSize>
                        </Box>
                      )}
                    </AspectRatioBox>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="contained"
                  component={Link}
                  to="/"
                >
                  Go to home
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <Grid container justifyContent="center" alignItems="center">
          <Typography variant="h3" align="center">
            Something wen't wrong
          </Typography>
        </Grid>
      )}
    </Box>
  );
};
