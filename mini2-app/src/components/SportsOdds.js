import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importando PropTypes
import { useGetSportsQuery, useGetOddsQuery } from '../api/OddsApi.js';
import styled from 'styled-components';

//Import das imagens
import Benfica from '../images/benfica.jpeg'
import Braga from '../images/braga.jpg'
import Porto from '../images/porto.jpg'
import Sporting from '../images/sporting.jpeg'
import vitoriaScImage from '../images/vitoriasc.jpg'
import ManchesterCity from '../images/city.jpg'
import ManchesterUnited from '../images/united.jpeg'
import Liverpool from '../images/liverpool.jpg'
import Arsenal from '../images/arsenal.png'
import Barcelona from '../images/barcelona.jpg'
import RealMadrid from '../images/real_madrid.jpg'
import BayernMunich from '../images/bayern.jpg'
import Juventus from '../images/juventus.jpg'
import ACmilan from '../images/acmilan.jpg'
import InterMilan from '../images/intermilan.jpg'


// Mapeamento das imagens das equipas
const teamImages = {
  "Manchester United": ManchesterUnited,
  "Manchester City": ManchesterCity,
  "Liverpool": Liverpool,
  "Arsenal": Arsenal,
  "Barcelona": Barcelona,
  "Real Madrid": RealMadrid,
  "Bayern Munich": BayernMunich,
  "Juventus": Juventus,
  "AC Milan": ACmilan,
  "Inter Milan": InterMilan,
  "Benfica": Benfica,
  "Sporting Lisbon": Sporting,
  "FC Porto": Porto,
  "Braga": Braga,
  "Vitória SC": vitoriaScImage,
};

// Função para atribuir odds corretamente (home e away)
const assignOddsCorrectly = (homeOdds, awayOdds, drawOdds) => {
  // Cria um array de odds e associa cada odd ao respetivo resultado
  const odds = [
    { type: 'home', value: homeOdds },
    { type: 'away', value: awayOdds },
    { type: 'draw', value: drawOdds },
  ];

  // Ordena as odds em ordem crescente de valores
  odds.sort((a, b) => a.value - b.value);

  // Retorna as odds reordenadas
  return {
    home: odds[0].value, // Menor odd (correspondente a equipa da casa)
    away: odds[1].value, // Odd intermediária (correspondente a equipa visitante)
    draw: odds[2].value, // Maior odd (correspondente ao empate)
  };
};

// Componente principal para exibir os desportos
const SportsOdds = () => {
  const apiKey = '87ddba20ba5d26895aceb7bbc3d8409e'; 
  const { data: sports, error: sportsError, isLoading: sportsLoading } = useGetSportsQuery(apiKey);

  if (sportsLoading) return <LoadingMessage>Carregando Desportos...</LoadingMessage>;
  if (sportsError) return <ErrorMessage>Erro ao carregar desportos: {sportsError.message}</ErrorMessage>;

  // Lista das ligas populares 
  const popularLeagues = ["EPL", "UEFA Europa Conference League", "UEFA Europa League", "UEFA Champions League", "La Liga - Spain", "Bundesliga - Germany", "Serie A - Italy", "Primeira Liga - Portugal"];

  // Lista das equipas populares
  const popularTeams = ["Manchester United", "Manchester City", "Liverpool", "Arsenal", "Barcelona", "Real Madrid", "Bayern Munich", "Juventus", "AC Milan", "Inter Milan", "Benfica", "Sporting Lisbon", "FC Porto", "Braga", "Vitória SC"];

  // Filtrar para mostrar apenas os desportos do grupo "soccer"
  const soccerSports = sports.filter(sport => sport.group === 'Soccer');
  
  // Filtro das ligas populares
  const popularSoccerSports = soccerSports.filter(sport => popularLeagues.includes(sport.title));

  return (
    <Wrapper>
      {popularSoccerSports && popularSoccerSports.length > 0 ? (
        <GamesContainer>
          {popularSoccerSports.map((sport) => (
            <Odds sportKey={sport.key} apiKey={apiKey} regions="us" key={sport.key}>
              {({ hasFanDuelOdds, fanduelOdds }) => {
                // Só renderiza se houver odds da FanDuel
                if (!hasFanDuelOdds) return null;

                // Agora cada jogo terá o seu próprio card
                return fanduelOdds
                  .filter((game) =>
                    popularTeams.includes(game.home_team) // Filtro para equipas populares a jogar em casa
                  )
                  .map((game, index) => {
                    const homeTeamImage = teamImages[game.home_team] || "https://via.placeholder.com/300";
                    

                    // Extraindo odds do primeiro mercado (exemplo: resultado final)
                    const market = game.bookmakers[0].markets[0];
                    const [homeOutcome, drawOutcome, awayOutcome] = market.outcomes;

                    // Garantindo que as odds sejam corretamente atribuídas
                    const { home, away, draw } = assignOddsCorrectly(
                      homeOutcome.price,
                      awayOutcome.price,
                      drawOutcome.price
                    );

                    return (
                      <GameCard key={index}>
                        <GameImage src={homeTeamImage} alt={game.home_team} />
                        <GameInfo>
                          <h3>{game.home_team} vs {game.away_team}</h3>
                          <OddsContainer>
                            <OddsRow>
                              <OddsButtons>
                                <OddsButton>{home}</OddsButton> 
                                <OddsButton>{draw}</OddsButton> 
                                <OddsButton>{away}</OddsButton> 
                              </OddsButtons>
                            </OddsRow>
                          </OddsContainer>
                        </GameInfo>
                      </GameCard>
                    );
                  });
              }}
            </Odds>
          ))}
        </GamesContainer>
      ) : (
        <ErrorMessage>Não há jogos para exibir.</ErrorMessage>
      )}
    </Wrapper>
  );
};

// Componente para exibir as odds de um jogo
const Odds = ({ sportKey, apiKey, regions, children }) => {
  const [cache, setCache] = useState({}); // Armazenar as odds no cache local
  const { data: odds, error: oddsError, isLoading: oddsLoading } = useGetOddsQuery({
    sportKey,
    apiKey,
    regions,
  });

  useEffect(() => {
    if (odds) {
      // Armazenando no cache quando as odds são carregadas
      setCache((prevCache) => ({
        ...prevCache,
        [sportKey]: odds,
      }));
    }
  }, [odds, sportKey]);

  const dataToRender = cache[sportKey] || odds;

  if (oddsLoading && !dataToRender) return <LoadingMessage>Carregando odds...</LoadingMessage>;
  if (oddsError) return <ErrorMessage>Erro ao carregar odds: {oddsError.message}</ErrorMessage>;

  // Filtrando as odds da FanDuel
  const fanduelOdds = dataToRender
    ? dataToRender
        .map((game) => {
          const fanduel = game.bookmakers.find((bookmaker) => bookmaker.key === 'fanduel');
          if (fanduel) {
            return {
              ...game,
              bookmakers: [fanduel], // Deixa apenas as odds da FanDuel
            };
          }
          return null;
        })
        .filter((game) => game !== null) // Excluindo jogos sem odds da FanDuel
    : [];

  // Se não houver odds da FanDuel, não renderiza nada
  const hasFanDuelOdds = fanduelOdds.length > 0;

  return (
    <>
      {children({ hasFanDuelOdds, fanduelOdds })}
    </>
  );
};

Odds.propTypes = {
  sportKey: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  regions: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired, // Aceita uma função como children
};

// Estilos com styled-components

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 0 20px;
  background-color: #f1f1f1;
  min-height: 100vh;
`;


const LoadingMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #e74c3c;
`;

const GamesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  padding: 20px;
`;

const GameCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const GameInfo = styled.div`
  background-color: white;
  padding: 20px;
  text-align: center;
`;

const OddsContainer = styled.div`
  padding: 20px;
`;

const OddsRow = styled.div`
  margin-bottom: 20px;
`;

const OddsButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const OddsButton = styled.button`
  background-color: #00ba60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 30%;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default SportsOdds;
