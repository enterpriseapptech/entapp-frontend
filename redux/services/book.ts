import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CreateBookingRequest {
  customerId: string;
  timeslotId: string[];
  serviceType: "EVENTCENTER" | "CATERING";
  totalBeforeDiscount: number;
  discount: number;
  totalAfterDiscount: number;
  bookingDates: string[];
  isTermsAccepted: boolean;
  isCancellationPolicyAccepted: boolean;
  isLiabilityWaiverSigned: boolean;
  source: "WEB" | string;
  serviceNotes: string;
  customerNotes: string;
  serviceId: string;
  eventName: string;
  eventTheme: string;
  eventType: string;
  description: string;
  noOfGuest: number;
  specialRequirements: string[];
}

export interface CreateBookingResponse {
  id: string;
  customerId: string;
  confirmedBy: string | null;
  confirmedAt: string | null;
  servicebookingId: string | null;
  serviceType: "EVENTCENTER" | "CATERING";
  totalBeforeDiscount: number;
  discount: number;
  totalAfterDiscount: number;
  paymentStatus: "UNPAID" | "PAID" | string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
  bookingDates: string[];
  isTermsAccepted: boolean;
  isCancellationPolicyAccepted: boolean;
  isLiabilityWaiverSigned: boolean;
  bookingReference: string;
  source: "WEB" | string;
  serviceNotes: string | null;
  customerNotes: string | null;
  rescheduledBy: string | null;
  rescheduledAt: string | null;
  previousDates: string[];
  canceledAt: string | null;
  cancelationReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface GetBookingsByServiceProviderResponse {
  count: number;
  data: CreateBookingResponse[];
}

export interface GetBookingsByServiceProviderQueryParams {
  serviceProvider: string;
  limit?: number;
  offset?: number;
}

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
    createBooking: builder.mutation<CreateBookingResponse, CreateBookingRequest>({
      query: (payload) => ({
        url: "/booking/create",
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

export const { useCreateBookingMutation, useGetBookingsByServiceProviderQuery } = bookingApi;