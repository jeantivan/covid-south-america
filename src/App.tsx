import {
  Box,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { ParentSize } from "@visx/responsive";
import React, { useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { AspectRatioBox } from "./components/AspectRatioBox";
import { Chart } from "./components/Chart";
import { CountryTable } from "./components/CountryTable";
//import { Details } from "./components/Details";
import { Navbar } from "./components/Navbar";
import { FLAG_PREFIX } from "./constants";
import { countries } from "./countries";
import {
  Country,
  CountryResponse,
  GlobalSummaryResponse,
  Status,
} from "./types";
import { computeLASummary, fetcher } from "./utils";

const useStyles = makeStyles((theme) => ({
  countryImg: {
    borderRadius: theme.spacing(0.5),
    width: 64,
    objectFit: "cover",
  },
}));

function App() {
  let aspectRatioBoxContent;

  const classes = useStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

  const [status, setStatus] = useState<Status>("Confirmed");

  const { data: globalData } = useSWR<GlobalSummaryResponse>(
    `https://api.covid19api.com/summary`,
    fetcher
  );

  const { data, error } = useSWR<CountryResponse[]>(
    `https://api.covid19api.com/dayone/country/${selectedCountry.Slug}`,
    fetcher
  );

  const laSummary = useMemo(() => computeLASummary(globalData), [globalData]);

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
    aspectRatioBoxContent = (
      <ParentSize>
        {({ width, height }) => (
          <Chart status={status} width={width} height={height} data={data} />
        )}
      </ParentSize>
    );
  }

  const scrollToChar = () => {
    if (containerRef.current !== null) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    return;
  };

  const handleSelectCountry = (country: Country) => {
    if (country === selectedCountry) {
      return;
    }

    setSelectedCountry(country);
    scrollToChar();
  };

  React.useEffect(() => {
    console.log({ globalData, data });
    console.log({ laSummary });
  }, [globalData, data, laSummary]);

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
      <Container component="main">
        <Box py={4}>
          <Box>
            <Typography variant="h4" component="h2">
              Resumen total
            </Typography>
            <Typography color="textSecondary">26 de septiembre 2020</Typography>
          </Box>
          <Box component="section" my={4}>
            <div ref={containerRef} aria-hidden="true" />
            <Grid container spacing={2}>
              <Grid item container xs={12}>
                <Grid xs={12} md={9} item container alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Box mr={4}>
                      <img
                        className={classes.countryImg}
                        src={`${FLAG_PREFIX}${selectedCountry.Slug}.jpg`}
                        alt={`Bandera de ${selectedCountry.Country}`}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h4">
                        {selectedCountry.Country}
                      </Typography>
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
              <Grid item xs={12}>
                <AspectRatioBox ratio={9 / 16}>
                  <Box height="100%">{aspectRatioBoxContent}</Box>
                </AspectRatioBox>
              </Grid>
              <Grid item xs={12} container spacing={2}>
                <Grid item sm={12}>
                  <Typography variant="h5" component="h3">
                    Casos por país
                  </Typography>
                </Grid>
                <Grid item lg={8}>
                  <CountryTable
                    laSummary={laSummary}
                    selectedCountry={selectedCountry}
                    handleSelectedCountry={handleSelectCountry}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default App;
