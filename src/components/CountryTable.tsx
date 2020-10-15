import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useNavigate } from "@reach/router";
import React from "react";
import { FLAG_PREFIX } from "../constants";
import { LASummary, SummaryCountryResponse } from "../types";
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
}));

interface CountryTableProps {
  laSummary?: LASummary;
}

export const CountryTable: React.FC<CountryTableProps> = ({ laSummary }) => {
  const classes = useStyles();
  const navigate = useNavigate();

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
                hover
                key={pais.Slug}
                onClick={() => {
                  navigate(`/country/${pais.Slug}`);
                }}
              >
                <TableCell>
                  <img
                    className={classes.countryImg}
                    src={`${FLAG_PREFIX}${pais.Slug}.png`}
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
