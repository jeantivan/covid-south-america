import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { Graticule, Mercator } from "@visx/geo";
import { Group } from "@visx/group";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";

import * as topojson from "topojson-client";
import topology from "../topojson/south-america.json";

import { FLAG_PREFIX } from "../constants";
import { SummaryCountryResponse } from "../types";

const sxCountryPath = (theme: any) => ({
  strokeWidth: 1,
  stroke: theme.palette.background.paper,
  strokeOpacity: 0.3,
  fill: theme.palette.grey[400],
  cursor: "pointer",

  "&:hover": {
    fill: theme.palette.primary.main,
  },
});

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

export const SouthAmericaMap = ({
  width,
  height,
  dataCountries,
}: SouthAmericaMapProps) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 550) * 100;

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
      <Box
        component="rect"
        x={0}
        y={0}
        width={width}
        height={height}
        rx={14}
        sx={(theme: any) => ({
          fill: theme.palette.background.paper,
        })}
      />
      <Mercator<FeatureShape>
        data={southAmerica.features}
        scale={scale}
        translate={[centerX, centerY]}
        // @ts-ignore
        fitSize={[[width, height - 40], southAmerica]}
      >
        {(mercator: any) => (
          <g width={width} height={height}>
            <Box
              component={Graticule}
              graticule={(g: any) => mercator.path(g) || ""}
              strokeDasharray="3,3"
              sx={(theme: any) => ({
                stroke: theme.palette.getContrastText(
                  theme.palette.background.default
                ),
                strokeOpacity: 0.3,
              })}
            />
            <Group top={20}>
              {mercator.features.map(
                ({ feature, path }: { feature: FeatureShape; path: any }) => (
                  <Box
                    component="path"
                    key={feature.properties.Country}
                    d={path || ""}
                    onMouseEnter={() => {
                      handleHover(feature);
                    }}
                    onMouseLeave={() => {
                      hideTooltip();
                    }}
                    onClick={() => {
                      navigate(`/country/${feature.properties.Slug}`);
                    }}
                    sx={[
                      sxCountryPath,
                      (theme: any) =>
                        feature.properties.Slug === "french-guiana"
                          ? {
                              fill: theme.palette.grey[600],
                              cursor: "not-allowed",
                              "&:hover": {
                                fill: theme.palette.grey[600],
                              },
                            }
                          : {},
                    ]}
                  />
                )
              )}
            </Group>
          </g>
        )}
      </Mercator>
      {tooltipData && (
        <div>
          <Box
            component={TooltipInPortal}
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            sx={(theme: any) => ({
              color: theme.palette.getContrastText(
                theme.palette.background.paper
              ),
              background: theme.palette.background.paper,
              boxShadow: theme.shadows[5],
              padding: theme.spacing(2),
              maxWidth: 200,
            })}
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
                <Typography component="span" fontWeight={700} color="info.main">
                  Confirmed:
                </Typography>{" "}
                {tooltipData.TotalConfirmed.toLocaleString()}
              </Typography>

              <Typography variant="body2">
                <Typography
                  component="span"
                  fontWeight={700}
                  color="error.main"
                >
                  Deaths:
                </Typography>{" "}
                {tooltipData.TotalDeaths.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <Typography
                  component="span"
                  fontWeight={700}
                  color="success.main"
                >
                  Recovered:
                </Typography>{" "}
                {tooltipData.TotalRecovered.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </div>
      )}
    </svg>
  );
};
