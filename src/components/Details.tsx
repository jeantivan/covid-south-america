import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  item: {
    marginRight: theme.spacing(4),
  },
  label: {
    fontWeight: 500,
  },
  number: {
    fontWeight: 600,
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

interface DetallesProps {
  Confirmed?: string;
  Recovered?: string;
  Deaths?: string;
}

export const Details: React.FC<DetallesProps> = ({
  Confirmed,
  Recovered,
  Deaths,
}) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item className={classes.item}>
        <Typography className={`${classes.label} ${classes.confirmed}`}>
          Confirmados
        </Typography>
        <Typography variant="h5" component="p" className={classes.number}>
          {Confirmed}
        </Typography>
      </Grid>
      <Grid item className={classes.item}>
        <Typography className={`${classes.label} ${classes.recovered}`}>
          Recuperados
        </Typography>
        <Typography variant="h5" component="p" className={classes.number}>
          {Recovered}
        </Typography>
      </Grid>
      <Grid item className={classes.item}>
        <Typography className={`${classes.label} ${classes.deaths}`}>
          Muertes
        </Typography>
        <Typography variant="h5" component="p" className={classes.number}>
          {Deaths}
        </Typography>
      </Grid>
    </Grid>
  );
};
