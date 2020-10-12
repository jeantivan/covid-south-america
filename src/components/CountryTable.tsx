import React from "react";

import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  fade,
} from "@material-ui/core";
import { LASummary, Country, SummaryCountryResponse } from "../types";
import { FLAG_PREFIX } from "../constants";
import { fixCountryName } from "../utils";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  countryImg: {
    borderRadius: theme.spacing(0.5),
    width: 64,
    objectFit: "cover",
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
  tableRow: {
    "&$selected": {
      backgroundColor: fade(theme.palette.info.main, 0.2),
      "&:hover": {
        backgroundColor: fade(theme.palette.info.main, 0.2),
      },
    },
  },
  selected: {},
}));

interface CountryTableProps {
  laSummary?: LASummary;
  selectedCountry: Country;
  handleSelectedCountry: (country: Country) => void;
}

export const CountryTable: React.FC<CountryTableProps> = ({
  laSummary,
  selectedCountry,
  handleSelectedCountry,
}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="Casos por pais">
        <TableHead>
          <TableRow>
            <TableCell>Flag</TableCell>
            <TableCell align="right">Country</TableCell>
            <TableCell align="right" className={classes.confirmed}>
              Confirmed
            </TableCell>
            <TableCell align="right" className={classes.recovered}>
              Recovered
            </TableCell>
            <TableCell align="right" className={classes.deaths}>
              Deaths
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {laSummary &&
            laSummary.Countries.map((pais: SummaryCountryResponse) => (
              <TableRow
                classes={{
                  root: classes.tableRow,
                  selected: classes.selected,
                }}
                key={pais.Slug}
                hover
                onClick={() => {
                  handleSelectedCountry(pais);
                }}
                selected={pais === selectedCountry}
              >
                <TableCell>
                  <img
                    className={classes.countryImg}
                    src={`${FLAG_PREFIX}${pais.Slug}.jpg`}
                    alt={`Bandera de ${pais.Country}`}
                  />
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  {fixCountryName(pais.Country)}
                </TableCell>
                <TableCell align="right">{pais.TotalConfirmed}</TableCell>
                <TableCell align="right">{pais.TotalRecovered}</TableCell>
                <TableCell align="right">{pais.TotalDeaths}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
