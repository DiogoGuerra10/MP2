import { configureStore } from '@reduxjs/toolkit';
import { oddsApi } from './api/OddsApi'; // Importe o serviço

export const store = configureStore({
  reducer: {
    [oddsApi.reducerPath]: oddsApi.reducer, // Adiciona o reducer do RTK Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(oddsApi.middleware), // Adiciona o middleware do RTK Query
});
