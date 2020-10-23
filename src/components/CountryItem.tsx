import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import React from "react";
import { FLAG_PREFIX } from "../constants";
import { SummaryCountryResponse } from "../types";

const useStyles = makeStyles((theme) => ({
  paper: {
    borderWidth: 2,
    cursor: "pointer",
    padding: theme.spacing(1),

    "&:hover": {
      borderColor: theme.palette.primary.main,
      boxShadow: theme.shadows[3],
    },
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  countryImg: {
    borderRadius: theme.spacing(0.5),
    width: 48,
    objectFit: "cover",
  },
  result: {
    fontWeight: 700,
  },
  confirmed: {
    color: theme.palette.info.main,
  },
  recovered: {
    color: theme.palette.success.main,
  },
  deaths: {
    color: theme.palette.error.main,
  },
}));

export const CountryItem: React.FC<SummaryCountryResponse> = ({
  Country,
  Slug,
  TotalConfirmed,
  TotalRecovered,
  TotalDeaths,
}) => {
  const classes = useStyles();
  return (
    <Paper variant="outlined" className={classes.paper}>
      <Link to={`/country/${Slug}`} className={classes.link}>
        <Grid container spacing={1}>
          <Grid item xs="auto">
            <img
              className={classes.countryImg}
              src={`${FLAG_PREFIX}${Slug}.png`}
              alt={`Bandera de ${Country}`}
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
            <Typography variant="body2" className={classes.confirmed}>
              Confirmed
            </Typography>
            <Typography className={classes.result}>
              {TotalConfirmed.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" className={classes.recovered}>
              Recovered
            </Typography>
            <Typography className={classes.result}>
              {TotalRecovered.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" className={classes.deaths}>
              Deaths
            </Typography>
            <Typography className={classes.result}>
              {TotalDeaths.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Link>
    </Paper>
  );
};
