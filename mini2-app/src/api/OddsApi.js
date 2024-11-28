import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Definindo a base da API
export const oddsApi = createApi({
  reducerPath: 'oddsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.the-odds-api.com/v4/' }),
  endpoints: (builder) => ({
    // Endpoint para ir buscar a lista de desportos
    getSports: builder.query({
      query: (apiKey) => `sports/?apiKey=${apiKey}`,
    }),
    // Endpoint para ir buscar as odds de um desporto
    getOdds: builder.query({
      query: ({ sportKey, apiKey, regions = 'us' }) =>
        `sports/${sportKey}/odds/?apiKey=${apiKey}&regions=${regions}`,
    }),
  }),
});

export const { useGetSportsQuery, useGetOddsQuery } = oddsApi;
