import {
  Box,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { RouteComponentProps } from "@reach/router";
import { ParentSize } from "@visx/responsive";
import { timeFormat } from "d3-time-format";
import React from "react";
import useSWR from "swr";
import { AspectRatioBox } from "../components/AspectRatioBox";
import { CasesChart } from "../components/CasesChart";
import { Seo } from "../components/Seo";
import { FLAG_PREFIX } from "../constants";
import { CountryResponse } from "../types";
import { fetcher, getCountryNameBySlug } from "../utils";

const useStyles = makeStyles((theme) => ({
  imgContainer: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      marginRight: theme.spacing(4),
    },
  },
  countryImg: {
    borderRadius: theme.spacing(0.5),
    width: 64,
    objectFit: "cover",
    [theme.breakpoints.up("md")]: {
      width: 80,
    },
  },
  Confirmed: {
    color: theme.palette.info.main,
  },
  Recovered: {
    color: theme.palette.success.main,
  },
  Deaths: {
    color: theme.palette.error.main,
  },
  result: {
    fontWeight: 700,
  },
}));

interface CountryPageProps extends RouteComponentProps {
  country?: string;
}

const margin = { top: 16, right: 16, bottom: 40, left: 45 };

type CasesType = "Confirmed" | "Recovered" | "Deaths";

const casesType: Array<CasesType> = ["Confirmed", "Recovered", "Deaths"];

export const CountryPage = (props: CountryPageProps) => {
  const { country } = props;
  const countryName = getCountryNameBySlug(country);

  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const { data, error } = useSWR<CountryResponse[]>(
    `https://api.covid19api.com/dayone/country/${country}`,
    fetcher
  );

  const lastUpdate = data ? data[data?.length - 1] : ({} as CountryResponse);
  return (
    <Box>
      <Seo title={`Cases in: ${countryName}`} />

      <Box display="flex" mb={4} component="section" id="title-section">
        <div className={classes.imgContainer}>
          <img
            className={classes.countryImg}
            src={`${FLAG_PREFIX}${country}.png`}
            alt={`Bandera de ${country}`}
          />
        </div>
        <Box flex={1}>
          <Typography variant="h4" component="h2" noWrap>
            {countryName}
          </Typography>
        </Box>
      </Box>

      {!error ? (
        <>
          <Box component="section" id="general-summary-section">
            <Grid container spacing={4}>
              <Grid xs={12} item container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" component="h3">
                    General summary
                  </Typography>
                </Grid>
                {casesType.map((caseType: CasesType) => (
                  <Grid item xs key={`summary-${caseType}`}>
                    <Typography variant="h6" className={classes[caseType]}>
                      {caseType}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="p"
                      className={classes.result}
                    >
                      {data ? (
                        lastUpdate[caseType].toLocaleString()
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </Grid>
                ))}
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
              {casesType.map((caseType: CasesType) => (
                <Grid item xs={12} key={`chart-${caseType}`}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h5" component="h3">
                        {caseType} cases
                      </Typography>
                    </Grid>
                    <Grid xs={12} item>
                      <AspectRatioBox ratio={isMobile ? 3 / 4 : 9 / 21}>
                        {!data ? (
                          <Skeleton variant="rect" height="100%" />
                        ) : (
                          <Box height="100%">
                            <ParentSize>
                              {({ width, height }) => (
                                <CasesChart
                                  width={width}
                                  height={height}
                                  data={data}
                                  dataKey={caseType}
                                  margin={margin}
                                />
                              )}
                            </ParentSize>
                          </Box>
                        )}
                      </AspectRatioBox>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      ) : (
        <Grid container justify="center" alignItems="center">
          <Typography variant="h3" align="center">
            Something wen't wrong
          </Typography>
        </Grid>
      )}
    </Box>
  );
};
