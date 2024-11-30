import React from 'react';
import styled from 'styled-components';

const Homepage = () => {
  return (
    <Wrapper>
      <Header>
        <Subtitle>MP2 - MCTW</Subtitle>
      </Header>

      <Section>
        <h2>Objetivo</h2>
        <p>
          - O objetivo deste projeto foi a criação de uma aplicação de front-end
          em React para consumir e visualizar informações provenientes de uma
          qualquer fonte pública de dados.
        </p>
        <p>
          Nesta aplicação foram utilizadas 2 APIs: uma para exibição de odds e
          jogos recentes, e outra para exibir logos das equipas, jogos recentes
          e tabelas classificativas. Além disso, foi implementada uma pipeline
          CI/CD para o seu deploy.
        </p>
      </Section>

      <Section>
        <h2>Tecnologias utilizadas</h2>
        <TechList>
          <TechItem>
            ⚛️ <strong>React</strong> - Biblioteca principal para a construção
            da aplicação
          </TechItem>
          <TechItem>
            🛠️ <strong>ESLint</strong> - Ferramenta para manter a qualidade do
            código
          </TechItem>
          <TechItem>
            🖥️ <strong>Javascript</strong> - Linguagem de programação principal
          </TechItem>
          <TechItem>
            🔧 <strong>Prettier</strong> - Ferramenta para formatação automática
            de código
          </TechItem>
          <TechItem>
            🧪 <strong>Jest</strong> - Framework de testes para JavaScript
          </TechItem>
          <TechItem>
            🔌 <strong>Reduxjs</strong> - Gerenciamento de estado global da
            aplicação
          </TechItem>
          <TechItem>
            ⚡ <strong>RTK Query</strong> - Ferramenta para realizar requisições
            API
          </TechItem>
          <TechItem>
            🚀 <strong>Redux Thunk</strong> - Middleware para lidar com ações
            assíncronas no Redux
          </TechItem>
          <TechItem>
            🎨 <strong>Styled Components</strong> - Biblioteca para estilização
            de componentes React
          </TechItem>
          <TechItem>
            📋 <strong>PropTypes</strong> - Ferramenta para validação de props
          </TechItem>
        </TechList>
      </Section>

      <Footer>
        <p>
          Desenvolvido por{' '}
          <FooterLink href="https://github.com/DiogoGuerra10" target="_blank">
            @DiogoGuerra10
          </FooterLink>
        </p>
        <p>
          Host na{' '}
          <FooterLink href="https://vercel.com/" target="_blank">
            Vercel
          </FooterLink>
        </p>
      </Footer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  font-family: Arial, sans-serif;
  color: #333;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Subtitle = styled.h2`
  font-size: 24px;
  color: #333;
`;

const Section = styled.section`
  margin-bottom: 40px;
  padding: 20px;
  flex: 1;
  border-radius: 8px;
`;

const TechList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TechItem = styled.li`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Footer = styled.footer`
  width: 100%;
  text-align: center;
  padding: 20px;
  background-color: #00ba60;
  color: #fff;
  margin-top: 40px;
`;

const FooterLink = styled.a`
  color: #fff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default Homepage;
