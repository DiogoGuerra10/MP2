import React from 'react';
import PropTypes from 'prop-types'; // Import dos PropTypes
import { useGetSportsQuery, useGetOddsQuery } from '../api/OddsApi.js';

const SportsOdds = () => {
  const apiKey = '149b23f8b0fd422303f188943774d92a'; 
  const { data: sports, error: sportsError, isLoading: sportsLoading } = useGetSportsQuery(apiKey);

  if (sportsLoading) return <p>Carregando Desportos...</p>;
  if (sportsError) return <p>Erro ao carregar desportos: {sportsError.message}</p>;

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
              <Odds sportKey={sport.key} apiKey={apiKey} regions="us" />
            </li>
          ))}
        </ul>
      ) : (
        <p>Não há desportos para exibir.</p>
      )}
    </div>
  );
};



// Componente para obter as odds de um desporto específico
const Odds = ({ sportKey, apiKey, regions }) => {
  const { data: odds, error: oddsError, isLoading: oddsLoading } = useGetOddsQuery({
    sportKey,
    apiKey,
    regions,
  });

  if (oddsLoading) return <p>Carregando odds...</p>;
  if (oddsError) return <p>Erro ao carregar odds: {oddsError.message}</p>;

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
        <p>Não há odds disponíveis para este desporto.</p>
      )}
    </div>
  );
};

// Adicionando a validação das props para Odds
Odds.propTypes = {
  sportKey: PropTypes.string.isRequired, // A chave do esporte é obrigatória
  apiKey: PropTypes.string.isRequired,  // A chave da API é obrigatória
  regions: PropTypes.string.isRequired, // A região é obrigatória
};

// Valores padrão para Odds
Odds.defaultProps = {
  regions: 'us', // Região padrão se não for especificada
};

export default SportsOdds;
