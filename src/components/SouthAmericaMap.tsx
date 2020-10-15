import { makeStyles, Typography } from "@material-ui/core";
import { useNavigate } from "@reach/router";
import { Graticule, Mercator } from "@visx/geo";
import { Group } from "@visx/group";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import React, { useCallback } from "react";
import * as topojson from "topojson-client";
import topology from "../south-america.json";
import { LASummary } from "../types";

export const background = "#f9f7e8";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    color: theme.palette.getContrastText(theme.palette.background.paper),
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    minWidth: 100,
  },
  countryPath: {
    strokeWidth: 1,
    stroke: background,
    fill: theme.palette.grey[400],
    cursor: "pointer",

    "&:hover": {
      fill: theme.palette.info.light,
    },
  },
}));

type Properties = { type: string; country: string; slug: string };

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

type TooltipData = Properties;

interface SouthAmericaProps {
  width: number;
  height: number;
  events?: boolean;
  data?: LASummary;
}

export const SouthAmericaMap: React.FC<SouthAmericaProps> = ({
  width,
  height,
  events = false,
  data,
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
      showTooltip({
        tooltipData: feature.properties,
        tooltipLeft: 10,
        tooltipTop: 10,
      });
    },
    [showTooltip]
  );

  return width < 10 ? null : (
    <svg width={width} height={height} ref={containerRef}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={background}
        rx={14}
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
              stroke="rgba(33,33,33,0.05)"
            />
            <Group top={20}>
              {mercator.features.map(({ feature, path }) => (
                <path
                  key={feature.properties.country}
                  d={path || ""}
                  className={classes.countryPath}
                  onMouseEnter={() => {
                    handleHover(feature);
                  }}
                  onMouseLeave={() => {
                    hideTooltip();
                  }}
                  onClick={() => {
                    navigate(`/country/${feature.properties.slug}`);
                  }}
                />
              ))}
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
            <Typography variant="h6" component="div">
              {tooltipData.country}
            </Typography>
            <Typography component="div">{tooltipData.type}</Typography>
            <Typography component="div">{tooltipData.slug}</Typography>
          </TooltipInPortal>
        </div>
      )}
    </svg>
  );
};
