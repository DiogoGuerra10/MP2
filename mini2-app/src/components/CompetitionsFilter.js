import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CompetitionsFilter = ({ selectedCompetition, onChange }) => {
  const competitions = [
    'EPL',
    'UEFA Champions League',
    'La Liga - Spain',
    'Bundesliga - Germany',
    'Serie A - Italy',
    'Primeira Liga - Portugal',
    'Ver Todos',
  ];

  return (
    <SidebarWrapper>
      <Title>Competições</Title>
      <List>
        {competitions.map((competition) => (
          <ListItem
            key={competition}
            isSelected={
              selectedCompetition === competition ||
              (competition === 'Ver Todos' && selectedCompetition === null)
            } // Marca a competição selecionada
            onClick={() =>
              onChange(competition === 'Ver Todos' ? null : competition)
            } // Limpa a seleção se for "Ver Todos"
          >
            {competition}
          </ListItem>
        ))}
      </List>
    </SidebarWrapper>
  );
};

CompetitionsFilter.propTypes = {
  selectedCompetition: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

CompetitionsFilter.defaultProps = {
  selectedCompetition: null, // Se não houver competição selecionada, exibe todos os jogos
};

// Estilos com styled-components

const SidebarWrapper = styled.div`
  width: 250px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? '#00ba60' : 'transparent'};
  color: ${({ isSelected }) => (isSelected ? '#fff' : '#333')};
  border-radius: 5px;
  margin-bottom: 8px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: #00ba60;
    color: #fff;
  }
`;
export default CompetitionsFilter;
