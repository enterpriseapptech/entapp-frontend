import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export enum ServiceType {
  EVENTCENTERS = "EVENTCENTERS",
  CATERING = "CATERING",
  ALL = "ALL",
}

export interface EventCenter {
  id: string;
  serviceProviderId: string;
  name: string;
  eventTypes: string[];
  depositAmount: number;
  totalAmount?: number;
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
  location: string;
  postal: string;
  status: string;
  rating?: number;
  paymentRequired: boolean;
  contact: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface EventCentersResponse {
  count: number;
  data: EventCenter[];
}

export interface CreateEventCenterRequest {
  serviceProviderId: string;
  name: string;
  eventTypes: string[];
  depositAmount: number;
  totalAmount: number;
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
  location: string;
  contact: string;
  postal: string;
  status: string;
}

export const eventsApi = createApi({
  reducerPath: "eventsApi",
 baseQuery: fetchBaseQuery({
    baseUrl: "http://16.171.68.229:8000",
    prepareHeaders: (headers) => {
      // Retrieve the access token from localStorage or sessionStorage
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
    getEventCenters: builder.query<
      EventCentersResponse,
      { limit: number; offset: number }
    >({
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
    getEventCentersByServiceProvider: builder.query<
      EventCentersResponse,
      {
        serviceProviderId: string;
        limit: number;
        offset: number;
      }
    >({
      query: ({ serviceProviderId, limit, offset }) => ({
        url: `/event-centers?serviceProvider=${serviceProviderId}&limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
    }),
    createEventCenter: builder.mutation<EventCenter, CreateEventCenterRequest>({
      query: (eventCenterData) => ({
        url: "/event-centers/create",
        method: "POST",
        body: eventCenterData,
      }),
    }),
  }),
});

export const {
  useGetEventCentersQuery,
  useGetEventCenterByIdQuery,
  useGetEventCentersByServiceProviderQuery,
  useCreateEventCenterMutation,
} = eventsApi;