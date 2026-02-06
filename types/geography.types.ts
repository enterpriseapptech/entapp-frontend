export interface Country {
  id: string;
  countryName: string;
  code: string;
  currency: string;
  currencySymbol: string;
  status: "Active" | "Inactive";
  lastUpdated: string;
  createdAt: string;
}

export interface NewCountry {
  countryName: string;
  code: string;
  currency: string;
  currencySymbol: string;
  status: string;
}

export interface State {
  id: string;
  stateName: string;
  country: string;
  countryId: string;
  status: "Active" | "Inactive";
  lastUpdated: string;
  createdAt: string;
}

export interface NewState {
  stateName: string;
  country: string;
  countryId: string;
  status: string;
}

export interface City {
  id: string;
  cityName: string;
  state: string;
  stateId: string;
  country: string;
  countryId: string;
  status: "Active" | "Inactive";
  lastUpdated: string;
  createdAt: string;
}

export interface NewCity {
  cityName: string;
  state: string;
  stateId: string;
  country: string;
  countryId: string;
  status: string;
}
