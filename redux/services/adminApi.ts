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
export interface CreateStateRequest {
  name: string;
  code: string;
  countryId: string;
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
// ================= USERS =================
export type UserType = "CUSTOMER" | "SERVICE_PROVIDER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  userType: UserType;
  status: UserStatus;
  lastLoginAt: string | null;
  loginAttempts: number;
  streetAddress: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;

  // backend currently returns null
  location: null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;

  // backend returns empty arrays
  catering: [];
  eventCenter: [];
}

export interface PaginatedUserResponse {
  count: number;
  docs: User[];
}

// ================= SUBSCRIPTION PLANS =================
export interface SubscriptionPlan {
  id: string;
  plan: string;
  amount: number;
  timeFrame: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface PaginatedSubscriptionPlanResponse {
  count: number;
  data: SubscriptionPlan[];
}

export interface CreateSubscriptionPlanRequest {
  plan: string;
  amount: number;
  timeFrame: number;
  status: string;
}

export interface UpdateSubscriptionPlanRequest {
  plan?: string;
  amount?: number;
  timeFrame?: number;
  status?: string;
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
  tagTypes: ["Country", "State", "Payment", "Invoice", "User", "SubscriptionPlan"],
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
    createState: builder.mutation<State, CreateStateRequest>({
      query: (body) => ({
        url: "/admin/state",
        method: "POST",
        body,
      }),
      invalidatesTags: ["State"],
    }),
    deleteState: builder.mutation<State, string>({
      query: (stateId) => ({
        url: `/admin/state/${stateId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, stateId) => [
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
    // ================= SUBSCRIPTION PLANS =================
    getSubscriptionPlans: builder.query<
      PaginatedSubscriptionPlanResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) => `/subscription-plans?limit=${limit}&offset=${offset}`,
      providesTags: ["SubscriptionPlan"],
    }),
    createSubscriptionPlan: builder.mutation<SubscriptionPlan, CreateSubscriptionPlanRequest>({
      query: (body) => ({
        url: "/subscription-plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),
    updateSubscriptionPlan: builder.mutation<
      SubscriptionPlan,
      { id: string; body: UpdateSubscriptionPlanRequest }
    >({
      query: ({ id, body }) => ({
        url: `/subscription-plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),
    deleteSubscriptionPlan: builder.mutation<SubscriptionPlan, string>({
      query: (id) => ({
        url: `/subscription-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),
    // ================= USERS =================
    getUsers: builder.query<
      PaginatedUserResponse,
      {
        limit: number;
        offset: number;
        userType?: UserType;
      }
    >({
      query: ({ limit, offset, userType }) => {
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
        });

        if (userType) {
          params.append("filter[userType]", userType);
        }

        return `/users?${params.toString()}`;
      },
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useGetStatesQuery,
  useCreateCountryMutation,
  useCreateStateMutation,
  useGetStateByIdQuery,
  useUpdateStateMutation,
  useDeleteStateMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useGetPaymentsQuery,
  useGetInvoicesQuery,
  useGetUsersQuery,
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
} = adminApi;
