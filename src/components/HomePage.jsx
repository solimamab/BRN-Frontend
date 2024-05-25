import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.scss';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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

  // Function to determine the route based on the document's template
  const navigateToEditor = (doc) => {
    const editorRoute = doc.template === 'neuro1' ? `/neuro1/${doc.unique_identifier}` : `/editor/${doc.unique_identifier}`;
    navigate(editorRoute);
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-left">
          <h1>BRN</h1>
          <button className="create-button" onClick={() => navigate('/editor', { state: { isNew: true } })}>
            Create New Document
          </button>
          <button className="template-button" onClick={() => navigate('/neuro1')}>
            Templates
          </button>
        </div>
      </header>
      <main className="document-list">
        {documents.length > 0 ? (
          <ul>
            {documents.map(doc => (
              <li key={doc.unique_identifier} className="document-item" onClick={() => navigateToEditor(doc)}>
                <div className="document-title">{doc.name || 'Untitled'}</div>
                <div className="document-template">Template: {doc.template}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents available</p>
        )}
      </main>
    </div>
  );
}

export default HomePage;