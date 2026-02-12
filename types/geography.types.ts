// Re-export types from adminApi to avoid duplication
export type {
  Country,
  State,
  CountryWithStates,
  StateWithCountry,
  CreateCountryRequest,
  UpdateStateRequest,
} from "@/redux/services/adminApi";

// ─── Country form type (used by AddCountryModal / EditCountryModal) ───────────
// Maps to CreateCountryRequest but with UI-friendly field names
export interface NewCountry {
  name: string;
  code: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
}

// ─── State form type (used by AddStateModal) ──────────────────────────────────
// Create-state API is coming soon; kept here so modals still compile
export interface NewState {
  name: string;
  code: string;
  countryId: string;
}

// ─── City types (city API is coming soon) ─────────────────────────────────────
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
