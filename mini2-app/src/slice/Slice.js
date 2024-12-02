import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Configuração da API usando RTK Query
export const oddsApi = createApi({
  reducerPath: 'oddsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.the-odds-api.com/v4/' }),
  endpoints: (builder) => ({
    // Endpoint para buscar as odds
    getOdds: builder.query({
      query: ({ sportKey, apiKey, regions = 'us' }) =>
        `sports/${sportKey}/odds/?apiKey=${apiKey}&regions=${regions}`,
    }),
  }),
});

// Exporta os hooks gerados automaticamente
export const { useGetOddsQuery } = oddsApi;
