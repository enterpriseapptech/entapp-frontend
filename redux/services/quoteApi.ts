import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postal: string;
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
}

export interface GetQuotesResponse {
  count: number;
  data: RequestQuoteResponse[];
}

export const quoteApi = createApi({
  reducerPath: "quoteApi",
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
  }),
});

export const { useRequestQuoteMutation, useGetQuotesByServiceIdQuery, useGetQuoteByIdQuery } =
  quoteApi;
