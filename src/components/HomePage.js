import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentEditor from './DocumentEditor';

const HomePage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/templates/');
            console.log('Fetched templates:', response.data);  // Debugging
            setTemplates(response.data); // Ensure templates is an array
        } catch (error) {
            console.error('Error fetching templates:', error.response?.data || error.message);
            setTemplates([]); // Set an empty array or handle error in UI
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
    };

    return (
        <div>
            <h1>Document Editor Home</h1>
            <h2>Select a Template</h2>
            {templates.length ? (
                templates.map((template) => (
                    <button key={template.id} onClick={() => handleTemplateSelect(template)}>{template.name}</button>
                ))
            ) : (
                <p>No templates available.</p>
            )}
            {selectedTemplate && <DocumentEditor template={selectedTemplate} />}
        </div>
    );
};

export default HomePage;
