import React from "react";
import { PaisType } from "../types";
import { fixCountryName } from "../utils";
import { Typography, Paper, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
    borderWidth: 2,
    cursor: "pointer",
    padding: theme.spacing(1),

    "&:hover": {
      borderColor: theme.palette.info.main,
      boxShadow: theme.shadows[3],
      transform: "scale(1.05)",
    },
  },
  active: {
    borderColor: theme.palette.info.main,
  },
  imgContainer: {
    display: "flex",
  },
  img: {
    objectFit: "cover",
    borderRadius: theme.spacing(0.5),
  },
}));

interface PaisProps {
  pais: PaisType;
  paisSeleccionado: PaisType;
  handleSelecionarPais: any;
}

export const Pais: React.FC<PaisProps> = ({
  pais,
  paisSeleccionado,
  handleSelecionarPais,
}) => {
  const classes = useStyles();
  return (
    <Paper
      variant="outlined"
      onClick={() => {
        handleSelecionarPais(pais);
      }}
      className={clsx(classes.paper, {
        [classes.active]: paisSeleccionado === pais,
      })}
    >
      <Grid container spacing={2}>
        <Grid item sm={4} container alignItems="center">
          <Grid item className={classes.imgContainer}>
            <img
              className={classes.img}
              src={`${process.env.PUBLIC_URL}/images/banderas/${pais.Slug}.jpg`}
              alt={`Bandera de ${fixCountryName(pais.Country)}`}
            />
          </Grid>
        </Grid>
        <Grid item sm={8}>
          <Typography variant="h6">{fixCountryName(pais.Country)}</Typography>
          <Typography variant="body2" color="textSecondary">
            /{pais.Slug}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
