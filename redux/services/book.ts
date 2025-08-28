import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// -------- REQUEST --------
export interface CreateBookingRequest {
  customerId: string;
  serviceId: string;
  timeslotId: string[];
  serviceType: "EVENTCENTER" | "CATERING";
  subTotal: number;
  discount: number;
  total: number;
  items: { item: string; amount: number }[];
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal: string;
  };
  dueDate: string; // ISO string
  isTermsAccepted: boolean;
  isCancellationPolicyAccepted: boolean;
  isLiabilityWaiverSigned: boolean;
  source: "WEB" | "MOBILE" | string;
  serviceNotes: string;
  customerNotes: string;
  eventName: string;
  eventTheme: string;
  eventType: string;
  description: string;
  noOfGuest: number;
  specialRequirements: string[];
}

// -------- RESPONSE --------
export interface CreateBookingResponse {
  id: string;
  userId: string;
  bookingId: string;
  items: { item: string; amount: number }[];
  subTotal: number;
  discount: number;
  total: number;
  amountDue: string;
  currency: string;
  note: string | null;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal: string;
  };
  status: "PENDING" | "BOOKED" | "RESERVED" | "POSTPONED" | "CANCELED" | string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

// -------- LIST RESPONSE --------
export interface GetBookingsByServiceProviderResponse {
  count: number;
  data: CreateBookingResponse[];
}

export interface GetBookingsByServiceProviderQueryParams {
  serviceProvider: string;
  limit?: number;
  offset?: number;
}

// -------- API SLICE --------
export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://13.61.137.254:8000",
    prepareHeaders: (headers) => {
      const accessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createBooking: builder.mutation<
      CreateBookingResponse,
      CreateBookingRequest
    >({
      query: (payload) => ({
        url: "/booking",
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getBookingsByServiceProvider: builder.query<
      GetBookingsByServiceProviderResponse,
      GetBookingsByServiceProviderQueryParams
    >({
      query: ({ serviceProvider, limit = 10, offset = 0 }) => ({
        url: `/booking`,
        method: "GET",
        params: {
          serviceProvider,
          limit,
          offset,
        },
      }),
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingsByServiceProviderQuery,
} = bookingApi;
