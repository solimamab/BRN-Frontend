import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <h1>Welcome to the Document Editor</h1>
      <button onClick={() => navigate('/editor')}>Create New Document</button>
    </div>
  );
}

export default HomePage;
