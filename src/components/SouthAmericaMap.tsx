import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import { useNavigate } from "@reach/router";
import { Graticule, Mercator } from "@visx/geo";
import { Group } from "@visx/group";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import React, { useCallback } from "react";
import * as topojson from "topojson-client";
import { FLAG_PREFIX } from "../constants";
import topology from "../topojson/south-america.json";
import { SummaryCountryResponse } from "../types";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    color: theme.palette.getContrastText(theme.palette.background.paper),
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    maxWidth: 200,
  },
  countryPath: {
    strokeWidth: 1,
    stroke: theme.palette.background.paper,
    strokeOpacity: 0.3,
    fill: theme.palette.grey[400],
    cursor: "pointer",

    "&:hover": {
      fill: theme.palette.primary.main,
    },
  },
  guiana: {
    fill: theme.palette.grey[600],
    cursor: "not-allowed",
    "&:hover": {
      fill: theme.palette.grey[600],
    },
  },
  bold: {
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
  rect: {
    fill: theme.palette.background.paper,
  },
  graticule: {
    stroke: theme.palette.getContrastText(theme.palette.background.default),
    strokeOpacity: 0.3,
  },
}));

type Properties = { type: string; Country: string; Slug: string };

interface FeatureShape {
  type: "Feature";
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: Properties;
}

// @ts-ignore
const southAmerica = topojson.feature(topology, topology.objects.units) as {
  type: "FeatureCollection";
  features: FeatureShape[];
};

type TooltipData = SummaryCountryResponse;

interface SouthAmericaMapProps {
  width: number;
  height: number;
  dataCountries: SummaryCountryResponse[];
}

export const SouthAmericaMap: React.FC<SouthAmericaMapProps> = ({
  width,
  height,
  dataCountries,
}) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 550) * 100;

  const classes = useStyles();
  const navigate = useNavigate();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
  });

  const {
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<TooltipData>();

  // tooltip handler
  const handleHover = useCallback(
    (feature: FeatureShape) => {
      const countryData = dataCountries.find(
        (country) => country.Slug === feature.properties.Slug
      );

      const tooltipData = countryData;

      showTooltip({
        tooltipData,
        tooltipLeft: 10,
        tooltipTop: 10,
      });
    },
    [showTooltip, dataCountries]
  );

  return width < 10 ? null : (
    <svg width={width} height={height} ref={containerRef}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={14}
        className={classes.rect}
      />
      <Mercator<FeatureShape>
        data={southAmerica.features}
        scale={scale}
        translate={[centerX, centerY]}
        fitSize={[[width, height - 40], southAmerica]}
      >
        {(mercator) => (
          <g width={width} height={height}>
            <Graticule
              graticule={(g) => mercator.path(g) || ""}
              className={classes.graticule}
              strokeDasharray="3,3"
            />
            <Group top={20}>
              {mercator.features.map(({ feature, path }) =>
                feature.properties.Slug === "french-guiana" ? (
                  <path
                    key={feature.properties.Country}
                    d={path || ""}
                    className={`${classes.countryPath} ${classes.guiana}`}
                  />
                ) : (
                  <path
                    key={feature.properties.Country}
                    d={path || ""}
                    className={classes.countryPath}
                    onMouseEnter={() => {
                      handleHover(feature);
                    }}
                    onMouseLeave={() => {
                      hideTooltip();
                    }}
                    onClick={() => {
                      navigate(`/country/${feature.properties.Slug}`);
                    }}
                  />
                )
              )}
            </Group>
          </g>
        )}
      </Mercator>
      {tooltipData && (
        <div>
          <TooltipInPortal
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            className={classes.tooltip}
          >
            <Grid container spacing={1}>
              <Grid item xs="auto">
                <img
                  width="32px"
                  src={`${FLAG_PREFIX}${tooltipData.Slug}.png`}
                  alt={`Bandera de ${tooltipData.Country}`}
                />
              </Grid>

              <Grid item xs zeroMinWidth>
                <Typography component="div" noWrap>
                  {tooltipData.Country}
                </Typography>
              </Grid>
            </Grid>
            <Box>
              <Typography variant="body2">
                <Typography
                  component="span"
                  className={`${classes.bold} ${classes.confirmed}`}
                >
                  Confirmed:
                </Typography>{" "}
                {tooltipData.TotalConfirmed.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <Typography
                  component="span"
                  className={`${classes.bold} ${classes.recovered}`}
                >
                  Recovered:
                </Typography>{" "}
                {tooltipData.TotalRecovered.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <Typography
                  component="span"
                  className={`${classes.bold} ${classes.deaths}`}
                >
                  Deaths:
                </Typography>{" "}
                {tooltipData.TotalDeaths.toLocaleString()}
              </Typography>
            </Box>
          </TooltipInPortal>
        </div>
      )}
    </svg>
  );
};
