import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Configuração da API da Free API Live Football Data
export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://free-api-live-football-data.p.rapidapi.com/', // Endpoint base da nova API
    prepareHeaders: (headers) => {
      // Adicionar cabeçalhos de autenticação do RapidAPI
      headers.set(
        'x-rapidapi-key',
        'e1e569e081mshd72c2e238262e6cp17d61ajsn43d3f4979277',
      ); // Sua chave de API RapidAPI
      headers.set(
        'x-rapidapi-host',
        'free-api-live-football-data.p.rapidapi.com',
      ); // Host da API
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint para pegar standings de uma competição
    getCompetitionStandings: builder.query({
      query: (leagueId) => `football-get-standing-all?leagueid=${leagueId}`, // Usando a nova estrutura de URL para standings
    }),
    // Endpoint para pegar informações head-to-head de um jogo (você pode ajustar conforme necessário)
    getMatchHead2Head: builder.query({
      query: (matchId) => `matches/${matchId}/head2head`, // A API atual não fornece esse endpoint, então você pode ajustar ou remover
    }),
  }),
});

// Exportando os hooks gerados automaticamente pelo Redux Toolkit
export const { useGetCompetitionStandingsQuery, useGetMatchHead2HeadQuery } =
  statisticsApi;
