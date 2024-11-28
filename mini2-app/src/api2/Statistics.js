import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://free-api-live-football-data.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      headers.set(
        'x-rapidapi-key',
        'e1e569e081mshd72c2e238262e6cp17d61ajsn43d3f4979277',
      );
      headers.set(
        'x-rapidapi-host',
        'free-api-live-football-data.p.rapidapi.com',
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint para ir buscar as  standings de uma competição
    getCompetitionStandings: builder.query({
      query: (leagueId) => `football-get-standing-all?leagueid=${leagueId}`,
    }),
  }),
});

// Exportando os hooks gerados automaticamente pelo Redux Toolkit
export const { useGetCompetitionStandingsQuery, useGetMatchHead2HeadQuery } =
  statisticsApi;
