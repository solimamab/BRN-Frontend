import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch documents from the backend
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents/');
        const data = await response.json();
        setDocuments(data);
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
          <li key={doc.id} onClick={() => navigate(`/editor/${doc.id}`)}>
            Document ID: {doc.uuid} {/* Assuming each document has a 'uuid' field */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;