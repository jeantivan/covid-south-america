import { fade, makeStyles, useTheme } from "@material-ui/core";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { GridColumns, GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, Bar, Line } from "@visx/shape";
import { defaultStyles, Tooltip, withTooltip } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { bisector, extent, max } from "d3-array";
import { timeFormat } from "d3-time-format";
import React, { useCallback, useMemo } from "react";
import { PaisResponse, StatusType } from "../types";

const tooltipStyles = {
  ...defaultStyles,
  background: "#3b6978",
  border: "1px solid white",
  color: "white",
};

const formatDate = timeFormat("%b %d, '%y");

// accessors
const getXValue = (d: PaisResponse): Date => new Date(d.Date);
const getYValue = (status: StatusType) => (d: PaisResponse) => d[status];
const bisectDate = bisector<PaisResponse, Date>((p) => new Date(p.Date)).left;

type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

type MyProps = AreaProps & {
  data?: PaisResponse[];
  status: StatusType;
};

type TooltipData = PaisResponse;

const useStyles = makeStyles((theme) => ({
  tick: {
    fill: theme.palette.getContrastText(theme.palette.background.paper),
    "& text": {
      fill: theme.palette.getContrastText(theme.palette.background.paper),
    },
  },
}));

export const Chart = withTooltip<MyProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 40, right: 0, bottom: 50, left: 50 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    data = [],
    status = "Confirmed",
  }: MyProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null;

    const classes = useStyles();
    const theme = useTheme();
    const contrastText = theme.palette.getContrastText(
      theme.palette.background.paper
    );
    const colorStatusKey =
      status === "Confirmed"
        ? "info"
        : status === "Recovered"
        ? "success"
        : "error";

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
          domain: [0, max(data, getYValue(status)) || 0 /* + yMax / 3 */],
          nice: true,
        }),
      [data, yMax, status]
    );

    React.useEffect(() => {
      console.log({ theme });
    }, [theme]);

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
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
          tooltipTop: yScale(getYValue(status)(d)),
        });
      },
      [showTooltip, xScale, yScale, data, status, margin]
    );

    return (
      <div>
        <svg width={width} height={height}>
          <Group left={margin.left} top={margin.top}>
            <rect
              x={0}
              y={0}
              width={xMax}
              height={yMax}
              fill={theme.palette.background.paper}
            />
            <GridRows
              scale={yScale}
              width={xMax}
              strokeDasharray="3,3"
              stroke={fade(
                theme.palette.getContrastText(theme.palette.background.default),
                0.8
              )}
              strokeOpacity={0.3}
              pointerEvents="none"
            />
            <GridColumns
              scale={xScale}
              height={yMax}
              strokeDasharray="3,3"
              stroke={fade(
                theme.palette.getContrastText(theme.palette.background.default),
                0.8
              )}
              strokeOpacity={0.3}
              pointerEvents="none"
            />
            <AreaClosed<PaisResponse>
              data={data}
              x={(d) => xScale(getXValue(d)) as number}
              y={(d) => yScale(getYValue(status)(d)) as number}
              yScale={yScale}
              strokeWidth={1}
              stroke={theme.palette[colorStatusKey].main}
              fill={theme.palette[colorStatusKey].light}
              fillOpacity={0.3}
              curve={curveMonotoneX}
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
            {tooltipData && (
              <g>
                <Line
                  from={{ x: tooltipLeft, y: 0 }}
                  to={{ x: tooltipLeft, y: yMax }}
                  stroke={fade(theme.palette[colorStatusKey].light, 0.5)}
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
                  fill={theme.palette[colorStatusKey].main}
                  stroke="white"
                  strokeWidth={2}
                  pointerEvents="none"
                />
              </g>
            )}
            <AxisLeft
              scale={yScale}
              tickClassName={classes.tick}
              stroke={contrastText}
              tickStroke={contrastText}
            />
            <AxisBottom
              top={yMax}
              scale={xScale}
              numTicks={10}
              tickClassName={classes.tick}
              stroke={contrastText}
              tickStroke={contrastText}
            />
          </Group>
        </svg>
        {tooltipData && (
          <div>
            <Tooltip
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`${status}: ${getYValue(status)(tooltipData)}`}
            </Tooltip>
            <Tooltip
              top={0}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: "center",
                transform: "translateX(-50%)",
              }}
            >
              {formatDate(getXValue(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);
