import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Editor from './components/Editor';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/editor/:id" element={<Editor />} />
            </Routes>
        </Router>
    );
};

export default App;