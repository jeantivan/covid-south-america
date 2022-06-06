import React, { ReactNode } from "react";
import Box from "@mui/material/Box";

interface AspectRatioBoxProps {
  children: ReactNode;
  ratio: number;
}

export const AspectRatioBox = ({
  ratio,
  children,
  ...rest
}: AspectRatioBoxProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 0,
        paddingTop: `${ratio * 100}%`,
      }}
      {...rest}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          inset: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
