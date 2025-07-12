import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./services/authApi";
import { eventsApi } from "./services/eventsApi";
import { cateringApi } from "./services/cateringApi";
import { timeslotApi } from "./services/timeslot";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [cateringApi.reducerPath]: cateringApi.reducer,
    [timeslotApi.reducerPath]: timeslotApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      eventsApi.middleware,
      cateringApi.middleware,
      timeslotApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
