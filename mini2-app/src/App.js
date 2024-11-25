import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SportsOdds from './components/SportsOdds.js';
import Navbar from './Navbar.js';
import GlobalStyles from './GlobalStyles.js'; 

const App = () => {
  return (
    <Router>
      <div>
        <GlobalStyles /> 
        <Navbar />
        <Routes>
          <Route path="/" element={<SportsOdds />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
