import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGetSportsQuery, useGetOddsQuery } from '../api/OddsApi.js';
import styled from 'styled-components';
import CompetitionsFilter from './CompetitionsFilter.js';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

//Import das imagens
import Benfica from '../images/benfica.jpeg';
import Braga from '../images/braga.jpg';
import Porto from '../images/porto.jpg';
import Sporting from '../images/sporting.jpeg';
import vitoriaScImage from '../images/vitoriasc.jpg';
import ManchesterCity from '../images/city.jpg';
import ManchesterUnited from '../images/united.jpeg';
import Liverpool from '../images/liverpool.jpg';
import Arsenal from '../images/arsenal.png';
import Barcelona from '../images/barcelona.jpg';
import RealMadrid from '../images/real_madrid.jpg';
import BayernMunich from '../images/bayern.jpg';
import Juventus from '../images/juventus.jpg';
import ACmilan from '../images/acmilan.jpg';
import InterMilan from '../images/intermilan.jpg';
import Chelsea from '../images/chelsea.jpg';

// Mapeamento das imagens das equipas
const teamImages = {
  'Manchester United': ManchesterUnited,
  'Manchester City': ManchesterCity,
  Liverpool: Liverpool,
  Arsenal: Arsenal,
  Barcelona: Barcelona,
  'Real Madrid': RealMadrid,
  'Bayern Munich': BayernMunich,
  Juventus: Juventus,
  'AC Milan': ACmilan,
  'Inter Milan': InterMilan,
  Benfica: Benfica,
  'Sporting Lisbon': Sporting,
  'FC Porto': Porto,
  Braga: Braga,
  'Vitória SC': vitoriaScImage,
  Chelsea: Chelsea,
};

// Função para formatar a hora ou data do jogo
const formatGameTime = (commenceTime) => {
  const gameDate = new Date(commenceTime);

  const dateOptions = {
    timeZone: 'Europe/Lisbon',
    year: '2-digit', // Ano com 2 dígitos
    month: '2-digit', // Mês com 2 dígitos
    day: '2-digit', // Dia com 2 dígitos
  };

  const formattedDate = new Intl.DateTimeFormat('pt-PT', dateOptions).format(
    gameDate,
  );

  const timeOptions = {
    timeZone: 'Europe/Lisbon',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedTime = new Intl.DateTimeFormat('pt-PT', timeOptions).format(
    gameDate,
  );

  return { formattedDate, formattedTime };
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

// Componente principal para exibir os jogos
const SportsOdds = () => {
  const apiKey = '423f5d929009729339fc15952a02e029';
  const {
    data: sports,
    error: sportsError,
    isLoading: sportsLoading,
  } = useGetSportsQuery(apiKey);

  const [selectedCompetition, setSelectedCompetition] = useState(null);

  if (sportsLoading)
    return (
      <LoadingMessage>
        <ClipLoader color="#00ba60" size={50} />
        <p>A carregar jogos...</p>
      </LoadingMessage>
    );
  if (sportsError)
    return (
      <ErrorMessage>Erro ao carregar jogos: {sportsError.message}</ErrorMessage>
    );

  // Lista das ligas populares
  const popularLeagues = [
    'EPL',
    'UEFA Champions League',
    'La Liga - Spain',
    'Bundesliga - Germany',
    'Serie A - Italy',
    'Primeira Liga - Portugal',
  ];

  // Lista das equipas populares
  const popularTeams = [
    'Manchester United',
    'Manchester City',
    'Liverpool',
    'Arsenal',
    'Barcelona',
    'Real Madrid',
    'Bayern Munich',
    'Juventus',
    'AC Milan',
    'Inter Milan',
    'Benfica',
    'Sporting Lisbon',
    'FC Porto',
    'Braga',
    'Vitória SC',
    'Chelsea',
  ];

  // Filtrar para mostrar apenas os desportos do grupo "soccer"
  const soccerSports = sports.filter((sport) => sport.group === 'Soccer');

  // Filtro das ligas populares
  const popularSoccerSports = soccerSports.filter((sport) =>
    popularLeagues.includes(sport.title),
  );

  // Filtrar os jogos com base na competição selecionada
  const filteredGames = selectedCompetition
    ? popularSoccerSports.filter((sport) => sport.title === selectedCompetition)
    : popularSoccerSports; // Se nenhuma competição estiver selecionada, mostra todas

  return (
    <Wrapper>
      <Sidebar>
        <CompetitionsFilter
          selectedCompetition={selectedCompetition}
          onChange={setSelectedCompetition} // Atualiza a competição selecionada
        />
      </Sidebar>
      <MainContent>
        {filteredGames && filteredGames.length > 0 ? (
          <GamesContainer>
            {filteredGames.map((sport) => (
              <Odds
                sportKey={sport.key}
                apiKey={apiKey}
                regions="us"
                key={sport.key}
              >
                {({ hasFanDuelOdds, fanduelOdds }) => {
                  if (!hasFanDuelOdds) return null;

                  // Agora cada jogo terá o seu próprio card
                  return fanduelOdds
                    .filter(
                      (game) => popularTeams.includes(game.home_team), // Filtro para equipas populares a jogar em casa
                    )
                    .map((game, index) => {
                      const homeTeamImage =
                        teamImages[game.home_team] ||
                        'https://via.placeholder.com/300';

                      const market = game.bookmakers[0].markets[0];
                      const [homeOutcome, drawOutcome, awayOutcome] =
                        market.outcomes;

                      const { home, away, draw } = assignOddsCorrectly(
                        homeOutcome.price,
                        awayOutcome.price,
                        drawOutcome.price,
                      );

                      const { formattedDate, formattedTime } = formatGameTime(
                        game.commence_time,
                      );

                      return (
                        <GameCard key={index}>
                          <StyledLink
                            to={`/details/${sport.key}/${game.home_team}/${game.away_team}`}
                          >
                            <Title>{sport.title}</Title>
                            <GameImage
                              src={homeTeamImage}
                              alt={game.home_team}
                            />
                            <GameInfo>
                              <DateContainer>{formattedDate}</DateContainer>
                              <h3>
                                {game.home_team} {formattedTime}{' '}
                                {game.away_team}
                              </h3>
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
                          </StyledLink>
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
      </MainContent>
    </Wrapper>
  );
};

// Componente para exibir as odds de um jogo
const Odds = ({ sportKey, apiKey, regions, children }) => {
  const [cache, setCache] = useState({}); // Armazenar as odds no cache local
  const {
    data: odds,
    error: oddsError,
    isLoading: oddsLoading,
  } = useGetOddsQuery({
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

  if (oddsLoading && !dataToRender)
    return (
      <LoadingMessage>
        <ClipLoader color="#00ba60" size={50} />
        <p>A carregar odds...</p>
      </LoadingMessage>
    );
  if (oddsError)
    return (
      <ErrorMessage>Erro ao carregar odds: {oddsError.message}</ErrorMessage>
    );

  // Filtrando as odds da FanDuel
  const fanduelOdds = dataToRender
    ? dataToRender
        .map((game) => {
          const fanduel = game.bookmakers.find(
            (bookmaker) => bookmaker.key === 'fanduel',
          );
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

  return <>{children({ hasFanDuelOdds, fanduelOdds })}</>;
};

Odds.propTypes = {
  sportKey: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  regions: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired, // Aceita uma função como children
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f1f1f1;
  min-height: 100vh;
  margin-top: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding-top: 80px;
  }
`;

const MainContent = styled.div`
  flex: 0 0 80%;
  padding: 20px;
`;

const Sidebar = styled.div`
  flex: 0 0 20%;
  padding: 20px;
  background-color: transparent;

  border-radius: 8px;
  @media (max-width: 768px) {
    flex: 0 0 100%;
    margin-bottom: 20px;
  }
`;
const Title = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  z-index: 1;
  font-weight: bold;
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 10px;
  }
`;

const GameCard = styled.div`
  position: relative;
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
  font-size: 15px;
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

const DateContainer = styled.div`
  font-size: 14px;
  color: #777;
  margin-bottom: 5px;
  text-align: center;
`;

const OddsButton = styled.button`
  background-color: #00ba60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  width: 30%;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
    color: inherit;
  }
`;

export default SportsOdds;
