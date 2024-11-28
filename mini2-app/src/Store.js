import { configureStore } from '@reduxjs/toolkit';
import { oddsApi } from './api/OddsApi.js';
import { statisticsApi } from './api2/Statistics.js';

export const store = configureStore({
  reducer: {
    [oddsApi.reducerPath]: oddsApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(oddsApi.middleware)
      .concat(statisticsApi.middleware),
});
