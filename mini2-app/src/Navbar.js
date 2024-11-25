import React from 'react';
import styled from 'styled-components';
import logo from './images/varplay.png'; 

const Navbar = () => {
  return (
    <Nav>
      <Logo src={logo} alt="Logo" />
    </Nav>
  );
};

export default Navbar;

// Estilização com styled-components
const Nav = styled.nav`
  display: flex;
  justify-content: center; 
  align-items: center;    
  height: 80px;           
  background-color: #3d4959; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
`;

const Logo = styled.img`
  height: 40px;  
  width: auto;   
`;