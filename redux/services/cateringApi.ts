import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export enum ServiceType {
  EVENTCENTERS = "EVENTCENTERS",
  CATERING = "CATERING",
  ALL = "ALL",
}

export interface Catering {
  id: string;
  name: string;
  serviceProviderId: string;
  tagLine: string;
  depositPercentage: number;
  discountPercentage: number;
  startPrice: number;
  minCapacity: number;
  maxCapacity: number;
  description: string;
  dishTypes: string[];
  cuisine: string[];
  images: string[];
  termsOfUse: string;
  cancellationPolicy: string;
  streetAddress: string;
  streetAddress2: string | null;
  city: string;
  location: string[];
  postal: string;
  status: string;
  isFeatured: boolean;
  featureExpiringAt: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  rating: number | null;
  paymentRequired: boolean;
  contact: string | null;
  eventTypes: string[];
}
export interface CateringResponse {
  count: number;
  data: Catering[];
}
export interface CreateCateringRequest {
  serviceProviderId: string;
  name: string;
  eventTypes: string[];
  location: string[];
  tagLine: string;
  depositPercentage: number;
  discountPercentage: number;
  startPrice: number;
  minCapacity: number;
  maxCapacity: number;
  cuisine: string[];
  description: string;
  dishTypes: string[];
  termsOfUse: string;
  cancellationPolicy: string;
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  postal: string;
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
export const cateringApi = createApi({
  reducerPath: "cateringApi",
  tagTypes: ["Catering"],
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
    getCaterings: builder.query<
      CateringResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) => ({
        url: `/catering?limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "Catering" as const, id })), { type: "Catering", id: "LIST" }]
          : [{ type: "Catering", id: "LIST" }],
    }),
    getCateringById: builder.query<Catering, string>({
      query: (id) => ({
        url: `/catering/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Catering", id }],
    }),
    getCateringsByServiceProvider: builder.query<
      CateringResponse,
      { serviceProviderId: string; limit: number; offset: number }
    >({
      query: ({ serviceProviderId, limit, offset }) => ({
        url: `/catering?serviceProvider=${serviceProviderId}&limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
      transformResponse: (response: CateringResponse) => ({
        ...response,
        data: [...response.data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "Catering" as const, id })), { type: "Catering", id: "LIST" }]
          : [{ type: "Catering", id: "LIST" }],
    }),
    createCatering: builder.mutation<Catering, CreateCateringRequest>({
      query: (formData) => ({
        url: "/catering",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Catering", id: "LIST" }],
    }),
    uploadCateringImages: builder.mutation<
      Catering,
      { cateringId: string; images: File[] }
    >({
      query: ({ cateringId, images }) => {
        const formData = new FormData();
        images.forEach((file) => {
          formData.append("imagefiles", file);
        });

        return {
          url: `/catering/${cateringId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _err, { cateringId }) => [{ type: "Catering", id: cateringId }, { type: "Catering", id: "LIST" }],
    }),
    updateCatering: builder.mutation<
      Catering,
      Partial<Catering> & { id: string }
    >({
      query: ({ id, ...patch }) => ({
        url: `/catering/${id}`,
        method: "PATCH",
        body: patch,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Catering", id }, { type: "Catering", id: "LIST" }],
    }),
    updateCateringWithImages: builder.mutation<
      Catering,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/catering/${id}/images`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Catering", id }, { type: "Catering", id: "LIST" }],
    }),
    deleteCatering: builder.mutation<void, string>({
      query: (id) => ({
        url: `/catering/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [{ type: "Catering", id }, { type: "Catering", id: "LIST" }],
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
    getCateringsByLocation: builder.query<CateringResponse, { locationId: string; limit?: number; offset?: number }>({
      query: ({ locationId, limit = 10, offset = 0 }) => ({
        url: `/catering?limit=${limit}&offset=${offset}&location=${locationId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "Catering" as const, id })), { type: "Catering", id: "LIST" }]
          : [{ type: "Catering", id: "LIST" }],
    }),
    getCateringsByCity: builder.query<
      CateringResponse,
      { city: string; limit: number; offset: number }
    >({
      query: ({ city, limit, offset }) => ({
        url: `/catering?city=${encodeURIComponent(city)}&limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "Catering" as const, id })), { type: "Catering", id: "LIST" }]
          : [{ type: "Catering", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCateringsQuery,
  useGetCateringByIdQuery,
  useGetCateringsByServiceProviderQuery,
  useCreateCateringMutation,
  useUploadCateringImagesMutation,
  useUpdateCateringMutation,
  useUpdateCateringWithImagesMutation,
  useDeleteCateringMutation,
  useGetCateringsByCityQuery,
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetCateringsByLocationQuery,
} = cateringApi;
