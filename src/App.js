import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TemplateEditor from './components/NeuroEditor';
import Editor from './components/Editor';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/neuro1" element={<TemplateEditor />} />
        <Route path="/neuro1/:id" element={<TemplateEditor />} />
      </Routes>
    </Router>
  );
};

export default App;