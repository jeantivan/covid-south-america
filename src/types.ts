export type Summary = {
  NewConfirmed: number;
  NewDeaths: number;
  NewRecovered: number;
  TotalConfirmed: number;
  TotalDeaths: number;
  TotalRecovered: number;
};

export type Country = {
  Country: string;
  Slug: string;
  ISO2: string;
  Date?: string;
};

export type CountryResponse = {
  Country: string;
  CountryCode: string;
  Slug: string;
  Confirmed: number;
  Deaths: number;
  Recovered: number;
  Active: number;
  Date: string;
  Province?: string;
  City?: string;
  CityCode?: string;
  Lat?: string;
  Lon?: string;
};

export type SummaryCountryResponse = Country &
  Summary & {
    Date: string;
    Premium?: any;
  };

export type GlobalSummaryResponse = {
  Global: Summary;
  Countries: SummaryCountryResponse[];
  Message: string;
  Date: string;
};

export type LASummary = {
  Summary: Summary;
  Countries: SummaryCountryResponse[];
  Date: string;
};
