import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export enum ServiceType {
  EVENTCENTERS = "EVENTCENTERS",
  CATERING = "CATERING",
  ALL = "ALL",
}

export interface EventCenter {
  id: string;
  serviceProviderId: string;
  depositAmount: number;
  description: string;
  pricingPerSlot: number;
  sittingCapacity: number;
  venueLayout: string;
  amenities: string[];
  images: string[];
  termsOfUse: string;
  cancellationPolicy: string;
  streetAddress: string;
  streetAddress2: string | null;
  city: string;
  state: string;
  country: string;
  postal: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  paymentRequired: boolean;
}

export interface EventCentersResponse {
  count: number;
  data: EventCenter[];
}

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://13.48.46.117:8000",
  }),
  endpoints: (builder) => ({
    getEventCenters: builder.query<EventCentersResponse, { limit: number; offset: number }>({
      query: ({ limit, offset }) => ({
        url: `/event-centers?limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
    }),
    getEventCenterById: builder.query<EventCenter, string>({
      query: (id) => ({
        url: `/event-centers/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetEventCentersQuery, useGetEventCenterByIdQuery } = eventsApi;