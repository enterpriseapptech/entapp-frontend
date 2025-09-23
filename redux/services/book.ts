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
export interface BookingEntity {
  id: string;
  requestQuoteId: string | null;
  customerId: string;
  confirmedBy: string | null;
  confirmedAt: string | null;
  servicebookingId: string | null;
  serviceId: string;
  serviceProvider: string;
  serviceType: "EVENTCENTER" | "CATERING" | string;
  subTotal: number;
  discount: number;
  total: number;
  invoice: [];
  paymentStatus: "UNPAID" | "PAID" | string;
  status: "PENDING" | "BOOKED" | "RESERVED" | "POSTPONED" | "CANCELED" | string;
  isTermsAccepted: boolean;
  isCancellationPolicyAccepted: boolean;
  isLiabilityWaiverSigned: boolean;
  bookingReference: string;
  source: "WEB" | "MOBILE" | string;
  serviceNotes: string;
  customerNotes: string;
  rescheduledBy: string | null;
  rescheduledAt: string | null;
  previousDates: string[];
  cancelledBy: string | null;
  canceledAt: string | null;
  cancelationReason: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

// -------- LIST RESPONSE --------
export interface GetBookingsByServiceProviderResponse {
  count: number;
  data: BookingEntity[];
}
export interface GetBookingsByServiceProviderQueryParams {
  serviceId: string;
  limit?: number;
  offset?: number;
}
export interface InvoiceEntity {
  id: string;
  bookingId: string;
  invoiceReference: string;
  items: { item: string; amount: number }[];
  subTotal: number;
  discount: number;
  total: number;
  amountDue: string;
  currency: string;
  status: "PENDING" | "PAID" | "CANCELED" | string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}
export interface GetInvoicesResponse {
  count: number;
  data: InvoiceEntity[];
}
export interface GetInvoicesQueryParams {
  bookingId: string;
  limit?: number;
  offset?: number;
}
// -------- API SLICE --------
export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://31.97.143.49:8000",
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
      }),
    }),

    getBookingsByServiceProvider: builder.query<
      GetBookingsByServiceProviderResponse,
      GetBookingsByServiceProviderQueryParams
    >({
      query: ({ serviceId, limit = 10, offset = 0 }) => ({
        url: `/booking`,
        method: "GET",
        params: {
          serviceId,
          limit,
          offset,
        },
      }),
    }),
    getBookingById: builder.query<BookingEntity, string>({
      query: (id) => ({
        url: `/booking/${id}`,
        method: "GET",
      }),
    }),
    initiatePayment: builder.mutation<
      string,
      { invoiceId: string; paymentGateWay: string }
    >({
      query: (payload) => ({
        url: "/payment/initiate",
        method: "POST",
        body: payload,
        responseHandler: (response) => response.text(),
      }),
      transformResponse: (response: string) => {
        return response;
      },
    }),
    getInvoicesByBookingId: builder.query<
      GetInvoicesResponse,
      GetInvoicesQueryParams
    >({
      query: ({ bookingId, limit = 10, offset = 0 }) => ({
        url: `/invoice`,
        method: "GET",
        params: {
          bookingId,
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
  useGetBookingByIdQuery,
  useInitiatePaymentMutation,
  useGetInvoicesByBookingIdQuery,
} = bookingApi;
