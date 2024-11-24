import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SportsOdds from './components/SportsOdds.js';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SportsOdds />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
