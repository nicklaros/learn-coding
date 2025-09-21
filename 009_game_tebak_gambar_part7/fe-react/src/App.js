import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import Game from './Game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/game/:gameId" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;