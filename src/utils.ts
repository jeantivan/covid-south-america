import { PaisType, PaisResponse } from "./types";
import { paises } from "./paises";

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

export const filterLACountries = (othersCountries: PaisType[]) => {
  const laCountries = othersCountries.filter((otherCountry: PaisType) => {
    //let condition = false;
    return paises.forEach((p: PaisType) => {
      return p === otherCountry;
    });
    // for (let i = 0; i < paises.length; i++) {
    //   if (paises[i].Slug === country.Slug) {
    //     condition = true;
    //     break;
    //   }
    // }

    // return condition;
  });

  return laCountries; // Filtra los paises de Latinoamérica;
};
/*
export const laSummary = (globalSummary: Summary[]) => {
  let initial = {
    NewConfirmed: 0,
    NewDeaths: 0,
    NewRecovered: 0,
    TotalConfirmed: 0,
    TotalDeaths: 0,
    TotalRecovered: 0,
  };

  let lastUpdate = filterLACountries(globalSummary); // Ultimos datos de los paises de latinoamérica

  const summary = lastUpdate.reduce((tot, cur) => {
    return {
      NewConfirmed: tot.NewConfirmed + cur.NewConfirmed,
      NewDeaths: tot.NewDeaths + cur.NewDeaths,
      NewRecovered: tot.NewRecovered + cur.NewRecovered,
      TotalConfirmed: tot.TotalConfirmed + cur.TotalConfirmed,
      TotalDeaths: tot.TotalDeaths + cur.TotalDeaths,
      TotalRecovered: tot.TotalRecovered + cur.TotalRecovered,
    };
  }, initial); // Total

  return { summary, lastUpdate };
};
*/

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

export const sumData = (data: PaisResponse[]) => {
  let initial = {
    TotalConfirmed: 0,
    TotalDeaths: 0,
    TotalRecovered: 0,
  };

  const { TotalDeaths, TotalConfirmed, TotalRecovered } = data.reduce(
    (acc, currCountry) => ({
      TotalConfirmed: acc.TotalConfirmed + currCountry.Confirmed,
      TotalDeaths: acc.TotalDeaths + currCountry.Deaths,
      TotalRecovered: acc.TotalRecovered + currCountry.Recovered,
    }),
    initial
  );

  return {
    TotalConfirmed: formatTotal(TotalConfirmed),
    TotalDeaths: formatTotal(TotalDeaths),
    TotalRecovered: formatTotal(TotalRecovered),
  };
};
