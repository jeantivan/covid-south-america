import {
  Box,
  CircularProgress,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import { ParentSize } from "@visx/responsive";
import React, { useState } from "react";
import useSWR from "swr";
import { AspectRatioBox } from "../components/AspectRatioBox";
import { Chart } from "../components/Chart";
import { FLAG_PREFIX } from "../constants";
import { CountryResponse, Status } from "../types";
import { fetcher, getCountryNameBySlug } from "../utils";
import { timeFormat } from "d3-time-format";
import { Helmet } from "react-helmet";

interface CountryPageProps extends RouteComponentProps {
  country?: string;
}

const useStyles = makeStyles((theme) => ({
  countryImg: {
    borderRadius: theme.spacing(0.5),
    width: 64,
    objectFit: "cover",
  },
}));

export const CountryPage = (props: CountryPageProps) => {
  const { country } = props;
  const countryName = getCountryNameBySlug(country);
  let aspectRatioBoxContent, lastUpdate;

  const classes = useStyles();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.up("sm"));

  const [status, setStatus] = useState<Status>("Confirmed");

  const { data, error } = useSWR<CountryResponse[]>(
    `https://api.covid19api.com/dayone/country/${country}`,
    fetcher
  );

  if (error) {
    aspectRatioBoxContent = (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h5">Something wen't wrong</Typography>
      </Box>
    );
  }

  if (!data) {
    aspectRatioBoxContent = (
      <Box
        bgcolor="#303030"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (data) {
    lastUpdate = new Date(data[data.length - 1].Date);
    aspectRatioBoxContent = (
      <ParentSize>
        {({ width, height }) => (
          <Chart status={status} width={width} height={height} data={data} />
        )}
      </ParentSize>
    );
  }

  const handleChange = (e: any) => {
    switch (e.target.value) {
      case "Confirmed":
        setStatus("Confirmed");
        break;
      case "Deaths":
        setStatus("Deaths");
        break;
      case "Recovered":
        setStatus("Recovered");
        break;
      default:
        setStatus("Confirmed");
        break;
    }
  };
  return (
    <Box component="section" my={4}>
      <Helmet>
        <title>Casos en {countryName} | Covid 19 en Latinoamérica </title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item container xs={12}>
          <Grid xs={12} md={9} item container alignItems="center">
            <Box display="flex" alignItems="center">
              <Box mr={4}>
                <img
                  className={classes.countryImg}
                  src={`${FLAG_PREFIX}${country}.jpg`}
                  alt={`Bandera de ${country}`}
                />
              </Box>
              <Box>
                <Typography variant="h4">{countryName}</Typography>
                {lastUpdate && (
                  <Typography variant="body2" color="textSecondary">
                    {timeFormat("%d %B, '%Y")(lastUpdate)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid xs={12} md={3} item container alignItems="center">
            <TextField
              id="select-status"
              name="status"
              label="Ver:"
              select
              fullWidth
              variant="outlined"
              value={status}
              onChange={handleChange}
            >
              <MenuItem value="Confirmed">Confirmados</MenuItem>
              <MenuItem value="Recovered">Recuperados</MenuItem>
              <MenuItem value="Deaths">Muertos</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid item md={7}>
          <AspectRatioBox ratio={!isMobile ? 9 / 16 : 9 / 21}>
            <Box height="100%">{aspectRatioBoxContent}</Box>
          </AspectRatioBox>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            height="calc(100% - 70px)"
            mt="30px"
            ml="50px"
            bgcolor="#142fa2"
          ></Box>
        </Grid>
      </Grid>
    </Box>
  );
};
