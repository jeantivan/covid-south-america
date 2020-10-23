import React from "react";
import { Helmet } from "react-helmet";

import { useTheme } from "@material-ui/core";

interface SeoProps {
  title?: string;
  description?: string;
}

export const Seo: React.FC<SeoProps> = ({ title, description }) => {
  const theme = useTheme();
  return (
    <Helmet
      htmlAttributes={{
        lang: "en",
      }}
      title={title}
      titleTemplate="%s | Covid-19 en Sur América"
      defaultTitle="Covid-19 en Sur América"
      meta={[
        {
          name: "description",
          content: description || "Coronavirus cases in South America",
        },
        {
          name: "theme-color",
          content: theme.palette.primary.main,
        },
      ]}
    />
  );
};
