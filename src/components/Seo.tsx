import React from "react";
import { Helmet } from "react-helmet";

import useTheme from "@mui/material/styles/useTheme";

interface SeoProps {
  title: string;
  description?: string;
}

export const Seo = ({ title, description }: SeoProps) => {
  const theme = useTheme();
  return (
    <Helmet
      htmlAttributes={{
        lang: "en",
      }}
    >
      <title>{title + " | "}Covid-19 en Sur América</title>
      <meta
        name="description"
        content={description || "Coronavirus cases in South America"}
      />
      <meta name="theme-color" content={theme.palette.primary.main || "#fff"} />
    </Helmet>
  );
};
