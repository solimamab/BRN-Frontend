import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';

const DocumentEditor = ({ template }) => {
    const initialPaper = {
        name: '',
        introduction: '',
        theory: '',
        summary: '',
        url: '',
        experiments: []
    };
    const [document, setDocument] = useState({ template, content: {}, metadata: { paper: initialPaper } });

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
        onUpdate: ({ editor }) => {
            setDocument({ ...document, content: editor.getJSON() });
        }
    });

    const handlePaperChange = (e) => {
        setDocument({ ...document, metadata: { ...document.metadata, paper: { ...document.metadata.paper, [e.target.name]: e.target.value } } });
    };

    const handleExperimentChange = (index, e) => {
        const newExperiments = document.metadata.paper.experiments.map((exp, i) => {
            if (index === i) {
                return { ...exp, [e.target.name]: e.target.value };
            }
            return exp;
        });
        setDocument({ ...document, metadata: { ...document.metadata, paper: { ...document.metadata.paper, experiments: newExperiments } } });
    };

    const handleMeasurementChange = (expIndex, measIndex, e) => {
        const updatedExperiments = document.metadata.paper.experiments.map((exp, i) => {
            if (i === expIndex) {
                const updatedMeasurements = exp.measurements.map((meas, j) => {
                    if (j === measIndex) {
                        return { ...meas, [e.target.name]: e.target.value };
                    }
                    return meas;
                });
                return { ...exp, measurements: updatedMeasurements };
            }
            return exp;
        });
        setDocument({ ...document, metadata: { ...document.metadata, paper: { ...document.metadata.paper, experiments: updatedExperiments } } });
    };

    const addExperiment = () => {
        setDocument({
            ...document,
            metadata: {
                ...document.metadata,
                paper: {
                    ...document.metadata.paper,
                    experiments: [
                        ...document.metadata.paper.experiments,
                        { name: '', task: '', measurements: [] }
                    ]
                }
            }
        });
    };

    const addMeasurement = (expIndex) => {
        const updatedExperiments = document.metadata.paper.experiments.map((exp, index) => {
            if (index === expIndex) {
                return {
                    ...exp,
                    measurements: [
                        ...exp.measurements,
                        { description: '', parameters: '', interpretation: '', label: '', x: '', y: '', z: '', brodmann_area: '', show_brodmann: false }
                    ]
                };
            }
            return exp;
        });
        setDocument({ ...document, metadata: { ...document.metadata, paper: { ...document.metadata.paper, experiments: updatedExperiments } } });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/document/', document);
            console.log('Document saved:', response.data);
        } catch (error) {
            console.error('Error saving document:', error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h2>Edit Document: {template.name}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" onChange={handlePaperChange} placeholder="Paper Name" /><br />
                <button type="button" onClick={addExperiment}>Add Experiment</button>
                {/* TipTap Editor */}
                <EditorContent editor={editor} />
                <button type="submit">Save Document</button>
            </form>
        </div>
    );
};

export default DocumentEditor;