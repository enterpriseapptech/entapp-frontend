import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export enum ServiceType {
  EVENTCENTERS = "EVENTCENTERS",
  CATERING = "CATERING",
  ALL = "ALL",
}

export interface Catering {
  id: string;
  serviceProviderId: string;
  tagLine: string;
  depositAmount: number;
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
  state: string;
  country: string;
  location: string;
  postal: string;
  status: string;
  isFeatured: boolean;
  featureExpiringAt: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface CateringResponse {
  count: number;
  data: Catering[];
}

export const cateringApi = createApi({
  reducerPath: "cateringApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://13.48.46.117:8000",
  }),
  endpoints: (builder) => ({
    getCaterings: builder.query<CateringResponse, { limit: number; offset: number }>({
      query: ({ limit, offset }) => ({
        url: `/catering?limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
    }),
    getCateringById: builder.query<Catering, string>({
      query: (id) => ({
        url: `/catering/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCateringsQuery, useGetCateringByIdQuery } = cateringApi;
