// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { oddsApi } from './api/OddsApi.js';
import { statisticsApi } from './api2/Statistics.js';

export const store = configureStore({
  reducer: {
    [oddsApi.reducerPath]: oddsApi.reducer, // Adiciona o reducer do RTK Query
    [statisticsApi.reducerPath]: statisticsApi.reducer, // Adiciona o reducer do RTK Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(oddsApi.middleware)
      .concat(statisticsApi.middleware), // Adiciona o middleware do RTK Query
});
