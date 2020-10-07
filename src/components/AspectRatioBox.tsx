import React, { ReactNode } from "react";
import { Box, BoxProps, makeStyles } from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: 0,
    paddingTop: (props: { ratio: number }) => `${props.ratio * 100}%`,
  },

  inside: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
}));

interface AspectRatioBoxProps {
  children: ReactNode;
  ratio: number;
  boxProps: BoxProps;
}

export const AspectRatioBox: React.FC<AspectRatioBoxProps> = ({
  ratio,
  children,
  boxProps,
}) => {
  const classes = useStyles({ ratio });
  return (
    <Box className={classes.root} {...boxProps}>
      <div className={classes.inside}>{children}</div>
    </Box>
  );
};
