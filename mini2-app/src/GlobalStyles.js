import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #f1f1f1; 
    font-family: 'Arial', sans-serif; 
  }

  * {
    box-sizing: border-box; 
  }
`;

export default GlobalStyles;
