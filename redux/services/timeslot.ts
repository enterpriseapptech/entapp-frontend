import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TimeSlot {
  id: string;
  serviceId: string;
  serviceType: "CATERING" | "EVENTCENTERS";
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

export interface CreateTimeSlotRequest {
  serviceId: string;
  serviceType: "CATERING" | "EVENTCENTER";
  createdBy: string;
  slots: {
    startTime: string;
    endTime: string;
  }[];
}
export interface TimeSlotResponse {
  count: number;
  data: TimeSlot[];
}
export const timeslotApi = createApi({
  reducerPath: "timeslotApi",
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
    createTimeSlots: builder.mutation<TimeSlot[], CreateTimeSlotRequest>({
      query: (payload) => ({
        url: "/timeslot",
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getTimeSlotsByServiceProvider: builder.query<
      TimeSlotResponse,
      { serviceId: string; limit?: number; offset?: number; date?: string }
    >({
      query: ({ serviceId, limit = 10, offset = 0, date }) => {
        const params = new URLSearchParams({
          serviceId,
          limit: limit.toString(),
          offset: offset.toString(),
        });
        if (date) {
          params.append("date", date);
        }
        return {
          url: `/timeslot?${params.toString()}`,
          method: "GET",
        };
      },
    }),
    deleteTimeSlot: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/timeslot/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useCreateTimeSlotsMutation,
  useGetTimeSlotsByServiceProviderQuery,
  useDeleteTimeSlotMutation,
} = timeslotApi;
