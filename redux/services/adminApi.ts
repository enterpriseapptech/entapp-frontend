import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface State {
  id: string;
  name: string;
  code: string;
  countryId: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface CountryWithStates extends Country {
  states: State[];
}

export interface PaginatedCountryResponse {
  count: number;
  docs: Country[];
}

export interface PaginatedStateResponse {
  count: number;
  docs: State[];
}

export interface CreateCountryRequest {
  name: string;
  code: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  updatedBy: string;
}
export interface StateWithCountry {
  id: string;
  name: string;
  code: string;
  countryId: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
  deletedBy: string | null;
  country: {
    id: string;
    name: string;
    code: string;
    currency: string;
    currencyCode: string;
    currencySymbol: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string | null;
    deletedBy: string | null;
  };
}
export interface UpdateStateRequest {
  name?: string;
  code?: string;
  countryId?: string;
  updatedBy: string;
}
export interface UpdateCountryRequest {
  name?: string;
  code?: string;
  currency?: string;
  currencyCode?: string;
  currencySymbol?: string;
  updatedBy: string;
}
// ================= PAYMENTS =================
export interface Payment {
  id: string;
  invoiceId: string;
  paymentMethod: "STRIPE" | "PAYSTACK";
  userId: string;
  amount: number;
  amountCharged: number;
  reference: string;
  paymentReference: string;
  paymentAuthorization: string;
  paidAt: string;
  currency: string;
  paymentReason: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface PaginatedPaymentResponse {
  count: number;
  data: Payment[];
}

// ================= INVOICES =================
export interface InvoiceItem {
  item: string;
  amount: number;
}

export interface BillingAddress {
  city: string;
  state: string;
  postal: string;
  street: string;
  country: string;
}

export interface Invoice {
  id: string;
  reference: string;
  userId: string;
  bookingId: string;
  subscriptionId: string | null;
  items: InvoiceItem[];
  amountDue: number;
  currency: string;
  note: string;
  billingAddress: BillingAddress;
  status: "PENDING" | "PAID" | "CANCELLED";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface PaginatedInvoiceResponse {
  count: number;
  data: Invoice[];
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dev.banquetpay.com",
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Country", "State", "Payment", "Invoice"],
  endpoints: (builder) => ({
    getCountries: builder.query<
      PaginatedCountryResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) =>
        `/admin/country?limit=${limit}&offset=${offset}`,
      providesTags: ["Country"],
    }),
    getCountryById: builder.query<CountryWithStates, string>({
      query: (countryId) => `/admin/country/${countryId}`,
      providesTags: (_result, _err, id) => [{ type: "Country", id }],
    }),
    getStates: builder.query<
      PaginatedStateResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) =>
        `/admin/state?limit=${limit}&offset=${offset}`,
      providesTags: ["State"],
    }),
    createCountry: builder.mutation<Country, CreateCountryRequest>({
      query: (body) => ({
        url: "/admin/country",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Country"],
    }),
    updateCountry: builder.mutation<
      Country,
      { countryId: string; body: UpdateCountryRequest }
    >({
      query: ({ countryId, body }) => ({
        url: `/admin/country/${countryId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { countryId }) => [
        { type: "Country", id: countryId },
        "Country",
      ],
    }),
    deleteCountry: builder.mutation<Country, string>({
      query: (countryId) => ({
        url: `/admin/country/${countryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, countryId) => [
        { type: "Country", id: countryId },
        "Country",
      ],
    }),

    getStateById: builder.query<StateWithCountry, string>({
      query: (stateId) => `/admin/state/${stateId}`,
      providesTags: (_result, _error, id) => [{ type: "State", id }],
    }),
    updateState: builder.mutation<
      State,
      { stateId: string; body: UpdateStateRequest }
    >({
      query: ({ stateId, body }) => ({
        url: `/admin/state/${stateId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { stateId }) => [
        { type: "State", id: stateId },
        "State",
      ],
    }),
    // ================= PAYMENTS =================
    getPayments: builder.query<
      PaginatedPaymentResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) => `/payment?limit=${limit}&offset=${offset}`,
      providesTags: ["Payment"],
    }),

    // ================= INVOICES =================
    getInvoices: builder.query<
      PaginatedInvoiceResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) => `/invoice?limit=${limit}&offset=${offset}`,
      providesTags: ["Invoice"],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useGetStatesQuery,
  useCreateCountryMutation,
  useGetStateByIdQuery,
  useUpdateStateMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useGetPaymentsQuery,
  useGetInvoicesQuery,
} = adminApi;
