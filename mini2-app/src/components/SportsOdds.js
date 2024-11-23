import React from 'react';
import { useGetSportsQuery, useGetOddsQuery } from '../api/OddsApi';

const SportsOdds = () => {
  const apiKey = '149b23f8b0fd422303f188943774d92a'; // Sua chave de API
  const { data: sports, error: sportsError, isLoading: sportsLoading } = useGetSportsQuery(apiKey);

  if (sportsLoading) return <p>Carregando deportos...</p>;
  if (sportsError) return <p>Erro ao carregar deportos: {sportsError.message}</p>;

  return (
    <div>
      <h1>Lista de Desportos</h1>
      {sports && Array.isArray(sports) ? (
        <ul>
          {sports.map((sport) => (
            <li key={sport.key}>
              <h3>{sport.title}</h3>
              <p>{sport.description}</p>

              {/* Passando os parâmetros region e market para o componente Odds */}
              <Odds sportKey={sport.key} apiKey={apiKey} regions="us" markets="h2h" />
            </li>
          ))}
        </ul>
      ) : (
        <p>Não há desportos para exibir.</p>
      )}
    </div>
  );
};

// Componente para obter as odds de um esporte específico
const Odds = ({ sportKey, apiKey, regions, markets }) => {
  const { data: odds, error: oddsError, isLoading: oddsLoading } = useGetOddsQuery({
    sportKey,
    apiKey,
    regions,
    markets,
  });

  if (oddsLoading) return <p>Carregando odds...</p>;
  if (oddsError) return <p>Erro ao carregar as odds: {oddsError.message}</p>;

  return (
    <div>
      <h4>Odds:</h4>
      {odds && odds.length > 0 ? (
        <ul>
          {odds.map((odd) => (
            <li key={odd.key}>
              <p>{odd.title} - {odd.odds}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Não há odds disponíveis para este desporto</p>
      )}
    </div>
  );
};

export default SportsOdds;
