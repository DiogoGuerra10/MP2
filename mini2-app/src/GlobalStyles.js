import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #f1f1f1; /* Define o fundo de toda a página */
    font-family: 'Arial', sans-serif; /* Define uma fonte padrão */
  }

  * {
    box-sizing: border-box; /* Inclui padding e border nas dimensões */
  }
`;

export default GlobalStyles;