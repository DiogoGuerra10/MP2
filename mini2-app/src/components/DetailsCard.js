import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';

const DetailsCard = () => {
  const { competition, homeTeam, awayTeam } = useParams();
  const [homeLogo, setHomeLogo] = useState(null);
  const [awayLogo, setAwayLogo] = useState(null);
  const [stats, setStats] = useState(null);
  const [standings, setStandings] = useState(null);
  const [logos, setLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [competitionTitle, setCompetitionTitle] = useState(null);
  const [recentHomeMatches, setRecentHomeMatches] = useState([]);
  const [recentAwayMatches, setRecentAwayMatches] = useState([]);
  const [competitionLogo, setCompetitionLogo] = useState(null); //Estado para ir buscar o logo da competição

  const leagueIdMap = {
    soccer_epl: 47,
    soccer_uefa_champs_league: 42,
    soccer_spain_la_liga: 87,
    soccer_italy_serie_a: 55,
    soccer_germany_bundesliga: 54,
    soccer_portugal_primeira_liga: 61,
  };

  const teamNameMap = {
    'ac milan': 'milan',
    'manchester united': 'man united',
    'manchester city': 'man city',
    'nottingham forest': 'nottm forest',
    'bayern munich': 'bayern münchen',
    'inter milan': 'inter',
    'sporting lisbon': 'sporting cp',
    'vitória sc': 'vitoria de guimaraes',
    'casa pia': 'casa pia ac',
    '1. FC Heidenheim': 'fc heidenheim',
  };

  const normalizeName = (name) => {
    const normalized = name.trim().toLowerCase();
    return teamNameMap[normalized] || normalized; // Verifica o mapeamento ou mantém o nome original
  };

  const fetchTeamLogos = async (leagueId, homeTeamName, awayTeamName) => {
    try {
      // Aplicar o mapeamento dos nomes das equipas, se existirem no mapeamento
      const normalizedHomeTeamName =
        teamNameMap[homeTeamName.toLowerCase()] || homeTeamName.toLowerCase();
      const normalizedAwayTeamName =
        teamNameMap[awayTeamName.toLowerCase()] || awayTeamName.toLowerCase();

      // Chamada à API para obter todos os logotipos das equipas da liga
      const response = await fetch(
        `https://free-api-live-football-data.p.rapidapi.com/football-get-list-all-team?leagueid=${leagueId}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key':
              'e1e569e081mshd72c2e238262e6cp17d61ajsn43d3f4979277',
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar os logos das equipas');
      }

      const data = await response.json();

      if (!data || !data.response || !data.response.list) {
        throw new Error('Nenhum logo encontrado para as equipas');
      }

      const teamList = data.response.list;

      // Função para normalizar e comparar os nomes das equipas
      const normalizeName = (name) => name.trim().toLowerCase();

      // Filtrando os logos das equipas com base nos nomes das equipas passadas
      const homeTeamLogo = teamList.find(
        (team) =>
          normalizeName(team.shortName) ===
          normalizeName(normalizedHomeTeamName),
      );

      const awayTeamLogo = teamList.find(
        (team) =>
          normalizeName(team.shortName) ===
          normalizeName(normalizedAwayTeamName),
      );

      return {
        homeLogo: homeTeamLogo ? homeTeamLogo.logo : null,
        awayLogo: awayTeamLogo ? awayTeamLogo.logo : null,
      };
    } catch (error) {
      console.error('Erro ao buscar os logos:', error);
      return { homeLogo: null, awayLogo: null };
    }
  };

  useEffect(() => {
    const fetchLogos = async () => {
      const leagueId = leagueIdMap[competition]; // Obtém o ID da liga mapeado

      if (!leagueId) {
        setError('Liga não encontrada');
        return;
      }

      const { homeLogo, awayLogo } = await fetchTeamLogos(
        leagueId,
        homeTeam,
        awayTeam,
      );
      setHomeLogo(homeLogo);
      setAwayLogo(awayLogo);
    };

    fetchLogos();
  }, [competition, homeTeam, awayTeam]);

  //const para ir buscar o logo da competição
  const fetchCompetitionLogo = async () => {
    const leagueId = leagueIdMap[competition];
    if (!leagueId) {
      setError('ID da liga não mapeado para a competição');
      return;
    }

    try {
      const response = await fetch(
        `https://free-api-live-football-data.p.rapidapi.com/football-get-league-logo?leagueid=${leagueId}`,
        {
          headers: {
            'x-rapidapi-key':
              'e1e569e081mshd72c2e238262e6cp17d61ajsn43d3f4979277',
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Falha ao obter as equipas da competição');
      }

      const data = await response.json();

      if (data && data.response.url) {
        setCompetitionLogo(data.response.url);
      } else {
        setError('Logo da competição não encontrado');
      }
    } catch (err) {
      console.error('Erro ao obter logo da competição:', err);
      setError(err.message);
    }
  };

  const fetchCompetitionTitle = async () => {
    try {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/?apiKey=423f5d929009729339fc15952a02e029`,
      );

      if (!response.ok) {
        throw new Error('Falha na requisição para obter as ligas');
      }

      const data = await response.json();
      const sport = data.find((sport) => sport.key === competition);
      setCompetitionTitle(sport ? sport.title : competition);
    } catch (err) {
      setError(err.message);
    }
  };

  // Tentativa de jogos recentes
  const fetchRecentMatchesByTeam = async (leagueId, teamName) => {
    try {
      const response = await fetch(
        `https://free-api-live-football-data.p.rapidapi.com/football-get-all-matches-by-league?leagueid=${leagueId}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key':
              'e1e569e081mshd72c2e238262e6cp17d61ajsn43d3f4979277',
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar jogos da liga');
      }

      const data = await response.json();
      console.log('casa pia', data);

      if (!data || !data.response.matches) {
        throw new Error('Nenhum jogo encontrado para esta liga');
      }

      // Consolidação de todos os jogos
      const allMatches = Object.values(data.response.matches).flat();

      // Filtrar os jogos da equipa específica
      const recentMatches = allMatches
        .filter(
          (match) =>
            (normalizeName(match.home.name) === normalizeName(teamName) ||
              normalizeName(match.away.name) === normalizeName(teamName)) &&
            match.status.finished, // Apenas jogos finalizados
        )
        .slice(0, 5);

      return recentMatches;
    } catch (error) {
      console.error(`Erro ao buscar jogos da equipa ${teamName}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchRecentMatches = async () => {
      const leagueId = leagueIdMap[competition];
      if (!leagueId) {
        setError('ID da liga não encontrado para a competição');
        return;
      }

      try {
        const homeMatches = await fetchRecentMatchesByTeam(leagueId, homeTeam);
        const awayMatches = await fetchRecentMatchesByTeam(leagueId, awayTeam);

        setRecentHomeMatches(homeMatches);
        setRecentAwayMatches(awayMatches);
      } catch (err) {
        console.error('Erro ao carregar jogos recentes:', err);
        setError(err.message);
      }
    };

    fetchRecentMatches();
  }, [homeTeam, awayTeam, competition]);

  // Função para buscar as estatísticas do jogo
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${competition}/scores/?daysFrom=3&apiKey=423f5d929009729339fc15952a02e029`,
      );

      if (!response.ok) {
        throw new Error('Falha na requisição para a API');
      }

      const data = await response.json();

      const match = data.find(
        (game) =>
          game.home_team.toLowerCase() === homeTeam.toLowerCase() &&
          game.away_team.toLowerCase() === awayTeam.toLowerCase(),
      );

      if (!match) {
        throw new Error('Jogo não encontrado');
      }

      setStats(match);
    } catch (err) {
      setError(err.message);
    }
  };

  //Para ir buscar standings
  const fetchStandings = async () => {
    const leagueId = leagueIdMap[competition];

    if (!leagueId) {
      setError('ID da liga não mapeado para a Free API');
      return;
    }

    try {
      const standingsResponse = await fetch(
        `https://free-api-live-football-data.p.rapidapi.com/football-get-standing-all?leagueid=${leagueId}`,
        {
          headers: {
            'x-rapidapi-key':
              'e1e569e081mshd72c2e238262e6cp17d61ajsn43d3f4979277',
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
          },
        },
      );

      if (!standingsResponse.ok) {
        throw new Error('Falha ao obter as standings');
      }

      const standingsData = await standingsResponse.json();

      if (
        standingsData &&
        Array.isArray(standingsData.response.standing) &&
        standingsData.response.standing.length > 0
      ) {
        setStandings(standingsData.response.standing);
      } else {
        throw new Error('Standings não encontradas');
      }

      // Fetch logos
      const logosResponse = await fetch(
        `https://free-api-live-football-data.p.rapidapi.com/football-get-list-all-team?leagueid=${leagueId}`,
        {
          headers: {
            'x-rapidapi-key':
              'e1e569e081mshd72c2e238262e6cp17d61ajsn43d3f4979277',
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
          },
        },
      );

      if (!logosResponse.ok) {
        throw new Error('Falha ao obter os logotipos das equipas');
      }

      const logosData = await logosResponse.json();
      const teamLogos = {};
      logosData.response.list.forEach((team) => {
        teamLogos[team.id] = team.logo;
      });
      setLogos(teamLogos);
    } catch (err) {
      console.error('Erro ao obter standings ou logos:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCompetitionTitle();
        await fetchStats();
        await fetchStandings();
        await fetchCompetitionLogo();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [competition]);

  if (loading) {
    return (
      <LoadingContainer>
        <ClipLoader color="#36d7b7" size={50} />
        <p>Carregando estatísticas...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Wrapper>
      <Title>{competitionTitle || 'A carregar título da competição...'}</Title>
      {competitionLogo && (
        <LogoContainer>
          <img
            src={competitionLogo}
            alt="Logo da Competição"
            style={{ width: '100px', height: '100px' }}
          />
        </LogoContainer>
      )}
      <GameHeader>
        {homeLogo ? (
          <img
            src={homeLogo}
            alt={`${homeTeam} logo`}
            width="100"
            height="100"
            style={{ marginRight: '40px' }}
          />
        ) : (
          <p>Logo não encontrado</p>
        )}

        {awayLogo ? (
          <img
            src={awayLogo}
            alt={`${awayTeam} logo`}
            width="100"
            height="100"
            style={{ marginLeft: '40px' }}
          />
        ) : (
          <p>Logo não encontrado</p>
        )}
        <h2>
          {homeTeam} vs {awayTeam}
        </h2>
        <p>
          {stats && stats.commence_time
            ? new Date(stats.commence_time).toLocaleString()
            : 'Data indisponível'}
        </p>
      </GameHeader>

      <h2>Jogos anteriores</h2>
      <RecentMatchesContainer>
        <TeamMatches>
          <h3>{homeTeam}</h3>
          {recentHomeMatches.length > 0 ? (
            <ul>
              {recentHomeMatches.map((match, index) => (
                <li key={index}>
                  {match.home.name} {match.home.score || 0} -{' '}
                  {match.away.score || 0} {match.away.name} (
                  {new Date(match.status.utcTime).toLocaleDateString()})
                </li>
              ))}
            </ul>
          ) : (
            <p>Sem jogos recentes disponíveis para {homeTeam}.</p>
          )}
        </TeamMatches>
        <TeamMatches>
          <h3>{awayTeam}</h3>
          {recentAwayMatches.length > 0 ? (
            <ul>
              {recentAwayMatches.map((match, index) => (
                <li key={index}>
                  {match.home.name} {match.home.score || 0} -{' '}
                  {match.away.score || 0} {match.away.name} (
                  {new Date(match.status.utcTime).toLocaleDateString()})
                </li>
              ))}
            </ul>
          ) : (
            <p>Sem jogos recentes disponíveis para {awayTeam}.</p>
          )}
        </TeamMatches>
      </RecentMatchesContainer>

      <StandingsContainer>
        <h2>Classificação</h2>
        {standings && standings.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Logo</th>
                <th>Equipa</th>
                <th>Jogos</th>
                <th>Vitórias</th>
                <th>Empates</th>
                <th>Derrotas</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team) => (
                <tr key={team.id}>
                  <td>{team.idx}</td>
                  <td>
                    <img
                      src={logos[team.id] || 'placeholder_logo.png'}
                      alt={team.name}
                      style={{ width: '40px', height: '40px' }}
                    />
                  </td>
                  <td>{team.name}</td>
                  <td>{team.played}</td>
                  <td>{team.wins}</td>
                  <td>{team.draws}</td>
                  <td>{team.losses}</td>
                  <td>{team.pts}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Sem dados de classificação disponíveis</p>
        )}
      </StandingsContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
  background-color: #f1f1f1;
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; // para centralizar verticalmente
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1.2em;
  text-align: center;
  margin-top: 20px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  color: #333;
`;

const GameHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;
`;

const StandingsContainer = styled.div`
  margin-top: 30px;
  padding: 20px;

  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }
`;

const RecentMatchesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 20px;

  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TeamMatches = styled.div`
  width: 48%; /* Para exibir lado a lado */
  h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 10px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    font-size: 1rem;
    margin-bottom: 5px;
  }

  &:nth-child(2) {
    text-align: right;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 20px;
    text-align: center;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 10px;
`;

export default DetailsCard;
