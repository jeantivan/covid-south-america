import React, { useCallback, useMemo } from "react";

import { alpha, Paper, useTheme } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { Grid } from "@visx/grid";
import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, Bar, Line } from "@visx/shape";
import {
  defaultStyles,
  TooltipWithBounds,
  useTooltip,
  useTooltipInPortal,
} from "@visx/tooltip";

import { bisector, extent, max } from "d3-array";
import { timeFormat } from "d3-time-format";

import { CountryResponse } from "../types";
import { formatTotal } from "../utils";

const formatDate = timeFormat("%b %d, '%y");

// Accessors
const getXValue = (d: CountryResponse): Date => new Date(d.Date);
const getDataKeyValue = (dataKey: DataKeys) => (d: CountryResponse) =>
  d[dataKey];
const bisectDate = bisector<CountryResponse, Date>((p) => new Date(p.Date))
  .left;

// Styles
const useStyles = makeStyles((theme) => ({
  tick: {
    fill: theme.palette.getContrastText(theme.palette.background.paper),
    "& text": {
      fill: theme.palette.getContrastText(theme.palette.background.paper),
    },
  },
  rect: {
    fill:
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.background.paper,
  },
  tooltip: {
    zIndex: 2,
    borderRadius: "50%",
    background: "#35477d",
    position: "absolute",
  },
  grid: {
    strokeDasharray: "3,3",
    stroke: theme.palette.getContrastText(theme.palette.background.paper),
    pointerEvents: "none",
    "& > *": {
      stroke: theme.palette.getContrastText(theme.palette.background.paper),
      strokeOpacity: 0.3,
    },
  },
  Confirmed: {
    stroke: theme.palette.info.main,
    fill: theme.palette.info.light,
    fillOpacity: 0.3,
  },
  Recovered: {
    stroke: theme.palette.success.main,
    fill: theme.palette.success.light,
    fillOpacity: 0.3,
  },
  Deaths: {
    stroke: theme.palette.error.main,
    fill: theme.palette.error.light,
    fillOpacity: 0.3,
  },
}));

type DataKeys = "Confirmed" | "Recovered" | "Deaths";
type TooltipData = CountryResponse;
type CasesChartProps = {
  width: number;
  height: number;
  data: CountryResponse[];
  dataKey: DataKeys;
  margin: { top: number; right: number; bottom: number; left: number };
};

export const CasesChart = ({
  width,
  height,
  data,
  dataKey,
  margin,
}: CasesChartProps) => {
  const getYValue = getDataKeyValue(dataKey);
  const classes = useStyles();
  const theme = useTheme();

  const contrastText = theme.palette.getContrastText(
    theme.palette.background.paper
  );
  const colorDataKey =
    dataKey === "Confirmed"
      ? "info"
      : dataKey === "Recovered"
      ? "success"
      : "error";

  // Tooltip

  const { containerRef } = useTooltipInPortal({
    // use TooltipWithBounds
    detectBounds: true,
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
  });

  const {
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData>();

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(data, getXValue) as [Date, Date],
      }),
    [data, xMax]
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [0, (max(data, getYValue) || 0) + yMax / 3],
        nice: true,
      }),
    [data, yMax, getYValue]
  );

  // tooltip handler
  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      // Mouse X pos
      let { x } = localPoint(event) || { x: 0 };
      x -= margin.left;
      const x0 = xScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && getXValue(d1)) {
        d =
          x0.valueOf() - getXValue(d0).valueOf() >
          getXValue(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }

      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(getYValue(d)),
      });
    },
    [showTooltip, xScale, yScale, data, getYValue, margin]
  );

  return width < 10 ? null : (
    <Paper>
      <svg ref={containerRef} width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={xMax}
            height={yMax}
            numTicksRows={width < 600 ? 4 : 5}
            numTicksColumns={width < 600 ? 4 : undefined}
            className={classes.grid}
          />
          <AreaClosed<CountryResponse>
            data={data}
            x={(d) => xScale(getXValue(d)) as number}
            y={(d) => yScale(getYValue(d)) as number}
            yScale={yScale}
            strokeWidth={2}
            className={classes[dataKey]}
            curve={curveMonotoneX}
          />
          <AxisLeft
            scale={yScale}
            tickClassName={classes.tick}
            stroke={contrastText}
            tickStroke={contrastText}
            numTicks={width < 600 ? 4 : 5}
            tickFormat={(v) => `${formatTotal(Number(v))}`}
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            tickClassName={classes.tick}
            stroke={contrastText}
            tickStroke={contrastText}
            numTicks={width < 600 ? 4 : undefined}
          />
          <Bar
            x={0}
            y={0}
            width={xMax}
            height={yMax}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipOpen && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: yMax }}
                stroke={alpha(theme.palette[colorDataKey].light, 0.5)}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={theme.palette[colorDataKey].main}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </Group>
      </svg>
      {tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop - 40}
            left={tooltipLeft + 24}
            style={{
              ...defaultStyles,
              background: theme.palette.background.paper,
              color: contrastText,
              boxShadow: theme.shadows[5],
            }}
          >
            <div>{`${dataKey}: ${getYValue(
              tooltipData
            ).toLocaleString()}`}</div>
            <div>{formatDate(getXValue(tooltipData))}</div>
          </TooltipWithBounds>
        </div>
      )}
    </Paper>
  );
};
