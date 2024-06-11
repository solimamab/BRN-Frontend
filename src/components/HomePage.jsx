import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.scss';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const handleCreateDocument = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/documents/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to create document! Status: ${response.status}`);
      }
      const data = await response.json();
      navigate(`/editor/${data.unique_identifier}`);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const handleCreateNeuro1 = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/documents/neuro1/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to create neuro1 document! Status: ${response.status}`);
      }
      const data = await response.json();
      navigate(`/neuro1/${data.unique_identifier}`);
    } catch (error) {
      console.error('Error creating neuro1 document:', error);
    }
  };

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

  // Function to delete a document
  const deleteDocument = async (doc) => {
    const isNeuro1 = doc.template === 'neuro1';
    const confirmDelete = window.confirm(`Are you sure you want to delete this document${isNeuro1 ? " and all associated node data" : ""}? This action cannot be undone.`);
  
    if (confirmDelete) {
      const url = isNeuro1 
        ? `http://localhost:8000/api/documents/neuro1/delete/${doc.unique_identifier}` 
        : `http://localhost:8000/api/documents/delete/${doc.unique_identifier}`;
      
      try {
        const response = await fetch(url, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Remove the deleted document from the documents array
        setDocuments(documents.filter(d => d.unique_identifier !== doc.unique_identifier));
        alert('Document deleted successfully.');
      } catch (error) {
        console.error('Failed to delete document', error);
        alert('Failed to delete document: ' + error.message);
      }
    }
  };
  
  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-left">
          <h1>BRN</h1>
          <button className="create-button" onClick={handleCreateDocument}>
            Create New Document
          </button>
          <button className="template-button" onClick={handleCreateNeuro1}>
            Create Neuro1 Document
          </button>
        </div>
      </header>
      <main className="document-list">
        {documents.length > 0 ? (
          <ul>
            {documents.map(doc => (
              <li key={doc.unique_identifier} className="document-item">
                <div className="document-title" onClick={() => navigateToEditor(doc)}>
                  {doc.name || 'Untitled'}
                </div>
                <div className="document-template">Template: {doc.template}</div>
                <button onClick={() => deleteDocument(doc.unique_identifier)}>Delete</button>
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