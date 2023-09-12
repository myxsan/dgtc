export type Country = {
  code: string;
  continent: Continent;
  currency: string;
  languages: Language[];
  name: string;
};

export type Continent = {
  code: string;
  name: string;
};

export type Language = {
  code: string;
  name: string;
};
