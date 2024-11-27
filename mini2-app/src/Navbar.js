import React from 'react';
import styled from 'styled-components';
import logo from './images/varplay.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Nav>
      <Link to="/">
        <Logo src={logo} alt="Logo" />
      </Link>
      <NavLinks>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/games">Games</StyledLink>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;

// Estilização com styled-components
const Nav = styled.nav`
  display: flex;
  justify-content: space-between; /* Espaça o conteúdo entre os elementos */
  align-items: center;
  height: 80px;
  background-color: #3d4959;
  padding: 0 20px; /* Adiciona um pouco de espaçamento nas laterais */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  margin-left: 20px; /* Espaçamento entre os links */
  transition: color 0.3s ease;

  &:hover {
    color: #00ba60; /* Muda a cor ao passar o mouse */
  }
`;
