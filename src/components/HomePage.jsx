import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch documents from the backend
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/documents/list/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setDocuments(data);
        } else {
          console.error('Data is not an array', data);
        }
      } catch (error) {
        console.error('Failed to fetch documents', error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="homepage">
      <h1>Welcome to the Document Editor</h1>
      <button onClick={() => navigate('/editor', { state: { isNew: true } })}>
        Create New Document
      </button>
      <ul>
        {documents.map(doc => (
          <li key={doc.unique_identifier} onClick={() => navigate(`/editor/${doc.unique_identifier}`)}>
            Document: {doc.name || 'Untitled'} (ID: {doc.unique_identifier})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;