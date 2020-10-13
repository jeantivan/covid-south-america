import { countries } from "./countries";
import {
  GlobalSummaryResponse,
  LASummary,
  SummaryCountryResponse,
} from "./types";

let round2decimal = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const formatDate = (
  date: string,
  options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }
) => {
  let d = new Date(date);
  return d.toLocaleDateString("ve-ES", options);
};

export const formatTotal = (total: number): string =>
  total >= 10 ** 6
    ? round2decimal(total / 10 ** 6) + " M"
    : total >= 10 ** 5 && total <= 10 ** 6 - 1
    ? Math.round(total / 10 ** 3) + " k"
    : Number(total).toLocaleString("es-ES");

export const fetcher = (input: RequestInfo, init?: RequestInit | undefined) =>
  fetch(input, init).then((res) => res.json());

export const filterLACountries = (
  othersCountries: SummaryCountryResponse[]
) => {
  const laCountries = othersCountries.filter((otherCountry) => {
    let condition = false;
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].Slug === otherCountry.Slug) {
        condition = true;
        break;
      }
    }

    return condition;
  });

  return laCountries; // Filtra los paises de Latinoamérica;
};

export const computeLASummary = (
  globalSummary: GlobalSummaryResponse | undefined
): LASummary | undefined => {
  if (!globalSummary) return;

  let initial = {
    NewConfirmed: 0,
    NewDeaths: 0,
    NewRecovered: 0,
    TotalConfirmed: 0,
    TotalDeaths: 0,
    TotalRecovered: 0,
  };

  const laCountriesResponse = filterLACountries(globalSummary.Countries);

  const laTotalSummary = laCountriesResponse.reduce(
    (previousValue, currentValue) => {
      return {
        NewConfirmed: previousValue.NewConfirmed + currentValue.NewConfirmed,
        NewDeaths: previousValue.NewDeaths + currentValue.NewDeaths,
        NewRecovered: previousValue.NewRecovered + currentValue.NewRecovered,
        TotalConfirmed:
          previousValue.TotalConfirmed + currentValue.TotalConfirmed,
        TotalDeaths: previousValue.TotalDeaths + currentValue.TotalDeaths,
        TotalRecovered:
          previousValue.TotalRecovered + currentValue.TotalRecovered,
      };
    },
    initial
  );

  return {
    Date: globalSummary.Date,
    Summary: laTotalSummary,
    Countries: laCountriesResponse,
  };
};

export const fixCountryName = (country: string) => {
  switch (country) {
    case "Brazil":
      return "Brasil";
    case "Haiti":
      return "Haití";
    case "Mexico":
      return "México";
    case "Dominican Republic":
      return "R. Dominicana";
    case "Venezuela (Bolivarian Republic)":
      return "Venezuela";
    default:
      return country;
  }
};

export const getCountryNameBySlug = (slug: string | undefined) => {
  if (!slug) return "";

  const country = countries.find((c) => c.Slug === slug);

  if (!country) {
    return "";
  }

  return fixCountryName(country.Country);
};
