import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Definindo a base da API
export const oddsApi = createApi({
  reducerPath: 'oddsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.the-odds-api.com/v4/' }),
  endpoints: (builder) => ({
    // Endpoint para pegar a lista de esportes
    getSports: builder.query({
      query: (apiKey) => `sports/?apiKey=${apiKey}`,
    }),
    // Endpoint para pegar as odds de um esporte específico com os parâmetros regions e markets
    getOdds: builder.query({
      query: ({ sportKey, apiKey, regions = 'us', markets = 'h2h' }) => 
        `sports/${sportKey}/odds/?apiKey=${apiKey}&regions=${regions}&markets=${markets}`,
    }),
  }),
});

export const { useGetSportsQuery, useGetOddsQuery } = oddsApi;
