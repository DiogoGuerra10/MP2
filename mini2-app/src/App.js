import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SportsOdds from './components/SportsOdds.js';
import Navbar from './Navbar.js';
import GlobalStyles from './GlobalStyles.js';
import DetailsCard from './components/DetailsCard.js';
import Homepage from './Homepage.js';

const App = () => {
  return (
    <div>
      <GlobalStyles />
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/games" element={<SportsOdds />} />
        <Route
          path="/details/:competition/:homeTeam/:awayTeam"
          element={<DetailsCard />}
        />
      </Routes>
    </div>
  );
};

export default App;
