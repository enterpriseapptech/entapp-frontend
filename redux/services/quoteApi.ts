import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postal: string;
}

export interface RequestedTimeSlot {
  id: string;
  serviceId: string;
  serviceType: string;
  bookingId: string | null;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  previousBookings: [];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface Booking {
  id: string;
  requestQuoteId: string;
  customerId: string;
  confirmedBy: string | null;
  confirmedAt: string | null;
  servicebookingId: string | null;
  serviceId: string;
  serviceProvider: string;
  serviceType: string;
  subTotal: string;
  discount: string;
  total: string;
  invoice: [];
  paymentStatus: string;
  status: string;
  isTermsAccepted: boolean;
  isCancellationPolicyAccepted: boolean;
  isLiabilityWaiverSigned: boolean;
  bookingReference: string;
  source: string;
  serviceNotes: string | null;
  customerNotes: string | null;
  rescheduledBy: string | null;
  rescheduledAt: string | null;
  previousDates: [];
  cancelledBy: string | null;
  canceledAt: string | null;
  cancelationReason: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface RequestQuotePayload {
  customerId: string;
  serviceId: string;
  timeslotId: string[];
  serviceType: "CATERING" | "EVENTCENTER";
  budget: string;
  billingAddress: BillingAddress;
  isTermsAccepted: boolean;
  isCancellationPolicyAccepted: boolean;
  isLiabilityWaiverSigned: boolean;
  source: string;
  customerNotes?: string | null;
}

export interface RequestQuoteResponse {
  id: string;
  customerId: string;
  serviceId: string;
  serviceProvider: string;
  serviceType: string;
  budget: string;
  status: string;
  quoteReference: string;
  isTermsAccepted: boolean;
  isCancellationPolicyAccepted: boolean;
  isLiabilityWaiverSigned: boolean;
  source: string;
  customerNotes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  billingDetails: BillingAddress;
  billingAddress: BillingAddress;
  requestedTimeSlots: RequestedTimeSlot[];
  booking?: Booking;
}

export interface GetQuotesResponse {
  count: number;
  data: RequestQuoteResponse[];
}
export interface InvoiceItem {
  item: string;
  amount: number;
}

export interface InvoiceBillingAddress {
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
  billingAddress: InvoiceBillingAddress;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface GetInvoicesResponse {
  count: number;
  data: Invoice[];
}

export const quoteApi = createApi({
  reducerPath: "quoteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dev.banquetpay.com",
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
    requestQuote: builder.mutation<RequestQuoteResponse, RequestQuotePayload>({
      query: (payload) => ({
        url: "/requestQuote",
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getQuotes: builder.query<
      GetQuotesResponse,
      { limit?: number; offset?: number }
    >({
      query: ({ limit = 10, offset = 0 }) =>
        `/requestQuote?limit=${limit}&offset=${offset}`,
    }),
    getQuotesByServiceId: builder.query<
      GetQuotesResponse,
      { serviceId: string; limit?: number; offset?: number }
    >({
      query: ({ serviceId, limit = 10, offset = 0 }) =>
        `/requestQuote?limit=${limit}&offset=${offset}&serviceId=${serviceId}`,
    }),
    getQuoteById: builder.query<RequestQuoteResponse, string>({
      query: (id) => ({
        url: `/requestQuote/${id}`,
        method: "GET",
      }),
    }),
    getInvoicesByBookingId: builder.query<
      GetInvoicesResponse,
      { bookingId: string; limit?: number; offset?: number }
    >({
      query: ({ bookingId, limit = 10, offset = 0 }) =>
        `/invoice?limit=${limit}&offset=${offset}&bookingId=${bookingId}`,
    }),
    getQuotesByCustomerId: builder.query<
      GetQuotesResponse,
      { customerId: string; limit?: number; offset?: number }
    >({
      query: ({ customerId, limit = 10, offset = 0 }) =>
        `/requestQuote?limit=${limit}&offset=${offset}&customerId=${customerId}`,
    }),
  }),
});

export const {
  useRequestQuoteMutation,
  useGetQuotesByServiceIdQuery,
  useGetQuoteByIdQuery,
  useGetQuotesQuery,
  useGetInvoicesByBookingIdQuery,
  useGetQuotesByCustomerIdQuery,
} = quoteApi;
