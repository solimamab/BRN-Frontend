import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tiptap from './components/MenuBar.jsx';
import HomePage from './components/HomePage.jsx';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<Tiptap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;