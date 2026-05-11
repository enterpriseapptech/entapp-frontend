import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Subscription {
  id: string;
  serviceProviderId: string;
  serviceId: string;
  type: string;
  subscriptionplanId: string;
  status: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  serviceName: string | null;
  invoice?: Invoice | Invoice[];
}

export interface Invoice {
  id: string;
  reference: string;
  userId: string;
  serviceProviderId: string | null;
  bookingId: string | null;
  subscriptionId: string;
  serviceType: string;
  serviceId: string;
  subscriptionPlanId: string;
  items: Array<{ item: string; amount: number }>;
  amountDue: number | string;
  serviceChargeAmount: number | null;
  currency: string;
  note: string | null;
  billingAddress: {
    city: string;
    state: string;
    postal: string;
    street: string;
    country: string;
  };
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  paymentMethod: string;
  userId: string;
  amount: string | number;
  amountCharged: string | number;
  reference: string;
  paymentReference: string;
  paymentAuthorization: string;
  paidAt: string;
  currency: string;
  paymentReason: string;
  status: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface CreateSubscriptionRequest {
  serviceProviderId: string;
  serviceId: string;
  serviceType: string;
  type: "SUBSCRIPTIONPLANS";
  subscriptionplanId: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal: string;
  };
  currency: string;
}

export interface PaginatedSubscriptionResponse {
  count: number;
  docs: Subscription[];
}

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dev.banquetpay.com",
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    getSubscriptions: builder.query<
      PaginatedSubscriptionResponse,
      { limit: number; offset: number }
    >({
      query: ({ limit, offset }) =>
        `/subscriptions?limit=${limit}&offset=${offset}`,
      providesTags: ["Subscription"],
    }),
    getSubscriptionById: builder.query<Subscription, string>({
      query: (id) => `/subscriptions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Subscription", id }],
    }),
    createSubscription: builder.mutation<Subscription, CreateSubscriptionRequest>({
      query: (body) => ({
        url: "/subscriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useCreateSubscriptionMutation,
} = subscriptionApi;
