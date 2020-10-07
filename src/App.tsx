import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import { Details } from "./components/Details";
import { Navbar } from "./components/Navbar";
import { AspectRatioBox } from "./components/AspectRatioBox";
import { Pais } from "./components/Pais";
import { paises } from "./paises";
import { PaisType, StatusType } from "./types";
import { fetcher, sumData } from "./utils";
import { ParentSize } from "@visx/responsive";
import { Chart } from "./components/Chart";
import { mockData } from "./mock-data";

const useStyles = makeStyles((theme) => ({
  countryImg: {
    borderRadius: theme.spacing(0.5),
    width: 64,
    objectFit: "cover",
  },
}));

function App() {
  const classes = useStyles();

  let dataSummary;
  const containerRef = useRef<HTMLDivElement>(null);
  const [paisSeleccionado, setPaisSeleccionado] = useState(paises[0]);

  const [status, setStatus] = useState<StatusType>("Confirmed");

  const { data, error } = useSWR(
    `https://api.covid19api.com/dayone/country/${paisSeleccionado.Slug}`,
    fetcher
  );

  if (data) {
    dataSummary = sumData(data);
  }

  const scrollToChar = () => {
    if (containerRef.current !== null) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    return;
  };

  const handleSeleccionarPais = (pais: PaisType) => {
    if (pais === paisSeleccionado) {
      return;
    }

    setPaisSeleccionado(pais);
    scrollToChar();
  };

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
    <>
      <Navbar />
      <Box p={8} width="100%" maxWidth="1024px" m="auto">
        <Box mb={8}>
          <Typography variant="h4" component="h2">
            Resumen total
          </Typography>
          <Typography color="textSecondary">26 de septiembre 2020</Typography>
        </Box>
        <Box component="section" my={8}>
          <div ref={containerRef} aria-hidden="true" />

          <Grid container spacing={2}>
            <Grid item sm={12}>
              <AspectRatioBox ratio={9 / 16} boxProps={{ mb: 4 }}>
                <ParentSize>
                  {({ width, height }) => (
                    <Chart
                      status={status}
                      width={width}
                      height={height}
                      data={mockData}
                    />
                  )}
                </ParentSize>
                {/* <Box height="100%">
                  {error ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="h5">
                        Something wen't wrong
                      </Typography>
                    </Box>
                  ) : !data ? (
                    <Box
                      bgcolor="#303030"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ParentSize>
                      {({ width, height }) => (
                        <Chart
                          status={status}
                          width={width}
                          height={height}
                          data={data}
                        />
                      )}
                    </ParentSize>
                  )}
                </Box>
                */}
              </AspectRatioBox>

              <Grid container spacing={2}>
                <Grid item sm={2}>
                  <img
                    className={classes.countryImg}
                    src={`${process.env.PUBLIC_URL}/images/banderas/${paisSeleccionado.Slug}.jpg`}
                    alt={`Bandera de ${paisSeleccionado.Country}`}
                  />
                </Grid>
                <Grid sm={10} item container>
                  <Grid item sm={8}>
                    <Typography variant="h4">
                      {paisSeleccionado.Country}
                    </Typography>
                  </Grid>

                  <Grid item sm={4} style={{ flexShrink: 1 }}>
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
              </Grid>
              {!data ? null : (
                <Details
                  Confirmed={dataSummary?.TotalConfirmed}
                  Recovered={dataSummary?.TotalRecovered}
                  Deaths={dataSummary?.TotalDeaths}
                />
              )}
            </Grid>
            <Grid item sm={4}>
              <Box mb={2}>
                <Typography variant="h5" component="h3">
                  Casos por país
                </Typography>
              </Box>
              <Divider />
              {paises.map((pais) => (
                <Pais
                  key={pais.Slug}
                  pais={pais}
                  handleSelecionarPais={handleSeleccionarPais}
                  paisSeleccionado={paisSeleccionado}
                />
              ))}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default App;
