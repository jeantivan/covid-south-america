import React, { ReactNode } from "react";
import { Box, BoxProps, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
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
});

interface AspectRatioBoxProps extends BoxProps {
  children: ReactNode;
  ratio: number;
}

export const AspectRatioBox: React.FC<AspectRatioBoxProps> = ({
  ratio,
  children,
  ...rest
}) => {
  const classes = useStyles({ ratio });
  return (
    <Box className={classes.root} {...rest}>
      <div className={classes.inside}>{children}</div>
    </Box>
  );
};
