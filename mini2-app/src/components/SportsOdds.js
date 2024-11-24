import React from 'react';
import PropTypes from 'prop-types'; // Importando PropTypes

const Odds = ({ sportKey, apiKey, regions, markets }) => {
  const {
    data: odds,
    error: oddsError,
    isLoading: oddsLoading,
  } = useGetOddsQuery({
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
              <p>
                {odd.title} - {odd.odds}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Não há odds disponíveis para este desporto</p>
      )}
    </div>
  );
};

// Adicionando a validação das props
Odds.propTypes = {
  sportKey: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  regions: PropTypes.string.isRequired,
  markets: PropTypes.string.isRequired,
};

export default Odds;
