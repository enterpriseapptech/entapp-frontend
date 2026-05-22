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
  discountPercentage: number;
  depositPercentage: number;
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
  paymentRequired: boolean;
  rating: number | null;
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
  discountPercentage?: number;
  depositPercentage: number;
  description: string;
  pricingPerSlot: number;
  sittingCapacity: number;
  venueLayout: string;
  amenities: string[];
  termsOfUse: string;
  cancellationPolicy: string;
  streetAddress: string;
  streetAddress2?: string | null;
  city: string;
  location: string;
  contact: string;
  postal: string;
  status: string;
  // ❌ no `images` here since upload handled separately
}
export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
}

export interface CountryResponse {
  count: number;
  docs: Country[];
}

export interface State {
  id: string;
  name: string;
  code: string;
  countryId: string;
}

export interface StateResponse {
  count: number;
  docs: State[];
}
export const eventsApi = createApi({
  reducerPath: "eventsApi",
  tagTypes: ["EventCenter"],
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
    getEventCenters: builder.query<
      EventCentersResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) => ({
        url: `/event-centers?limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "EventCenter" as const, id })), { type: "EventCenter", id: "LIST" }]
          : [{ type: "EventCenter", id: "LIST" }],
    }),
    getEventCenterById: builder.query<EventCenter, string>({
      query: (id) => ({
        url: `/event-centers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "EventCenter", id }],
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
      transformResponse: (response: EventCentersResponse) => ({
        ...response,
        data: [...response.data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "EventCenter" as const, id })), { type: "EventCenter", id: "LIST" }]
          : [{ type: "EventCenter", id: "LIST" }],
    }),
    createEventCenter: builder.mutation<EventCenter, CreateEventCenterRequest>({
      query: (formData) => ({
        url: "/event-centers/create",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "EventCenter", id: "LIST" }],
    }),
    uploadEventCenterImages: builder.mutation<
      EventCenter,
      { eventCenterId: string; images: File[] }
    >({
      query: ({ eventCenterId, images }) => {
        const formData = new FormData();
        images.forEach((file) => {
          formData.append("imagefiles", file);
        });

        return {
          url: `/event-centers/${eventCenterId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _err, { eventCenterId }) => [{ type: "EventCenter", id: eventCenterId }, { type: "EventCenter", id: "LIST" }],
    }),
    updateEventCenter: builder.mutation<
      EventCenter,
      Partial<EventCenter> & { id: string }
    >({
      query: ({ id, ...patch }) => ({
        url: `/event-centers/${id}`,
        method: "PATCH",
        body: patch,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "EventCenter", id }, { type: "EventCenter", id: "LIST" }],
    }),
    updateEventCenterWithImages: builder.mutation<
      EventCenter,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/event-centers/${id}/images`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "EventCenter", id }, { type: "EventCenter", id: "LIST" }],
    }),
    deleteEventCenter: builder.mutation<void, string>({
      query: (id) => ({
        url: `/event-centers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [{ type: "EventCenter", id }, { type: "EventCenter", id: "LIST" }],
    }),
    getCountries: builder.query<CountryResponse, { limit?: number; offset?: number }>({
      query: ({ limit = 10, offset = 0 }) => ({
        url: `/admin/country?limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
    }),
    getStates: builder.query<StateResponse, { limit?: number; offset?: number }>({
      query: ({ limit = 10, offset = 0 }) => ({
        url: `/admin/state?limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
    }),
    getEventCentersByLocation: builder.query<EventCentersResponse, { locationId: string; limit?: number; offset?: number }>({
      query: ({ locationId, limit = 10, offset = 0 }) => ({
        url: `/event-centers?limit=${limit}&offset=${offset}&location=${locationId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "EventCenter" as const, id })), { type: "EventCenter", id: "LIST" }]
          : [{ type: "EventCenter", id: "LIST" }],
    }),
    getEventCentersByCity: builder.query<
      EventCentersResponse,
      { city: string; limit?: number; offset?: number }
    >({
      query: ({ city, limit = 10, offset = 0 }) => ({
        url: `/event-centers?city=${encodeURIComponent(city)}&limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "EventCenter" as const, id })), { type: "EventCenter", id: "LIST" }]
          : [{ type: "EventCenter", id: "LIST" }],
    }),
  }),
});

export const {
  useGetEventCentersQuery,
  useGetEventCenterByIdQuery,
  useGetEventCentersByServiceProviderQuery,
  useCreateEventCenterMutation,
  useUploadEventCenterImagesMutation,
  useUpdateEventCenterMutation,
  useUpdateEventCenterWithImagesMutation,
  useDeleteEventCenterMutation,
  useGetEventCentersByCityQuery,
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetEventCentersByLocationQuery,
} = eventsApi;
