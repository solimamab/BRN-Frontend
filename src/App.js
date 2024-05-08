import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [paper, setPaper] = useState({
        name: '',
        introduction: '',
        theory: '',
        summary: '',
        experiments: []
    });

    const handlePaperChange = (e) => {
        setPaper({ ...paper, [e.target.name]: e.target.value });
    };

    const handleExperimentChange = (index, e) => {
        const newExperiments = paper.experiments.map((exp, i) => {
            if (index === i) {
                return { ...exp, [e.target.name]: e.target.value };
            }
            return exp;
        });
        setPaper({ ...paper, experiments: newExperiments });
    };

    const handleMeasurementChange = (expIndex, measIndex, e) => {
        const updatedExperiments = paper.experiments.map((exp, i) => {
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
        setPaper({ ...paper, experiments: updatedExperiments });
    };

    const addExperiment = () => {
        setPaper({
            ...paper,
            experiments: [
                ...paper.experiments,
                { name: '', task_context: '', task: '', task_explained: '', discussion: '', measurements: [] }
            ]
        });
    };

    const addMeasurement = (expIndex) => {
        const updatedExperiments = paper.experiments.map((exp, index) => {
            if (index === expIndex) {
                return {
                    ...exp,
                    measurements: [
                        ...exp.measurements,
                        { description: '', parameters: '', interpretation: '', label: '', x: '', y: '', z: '' }
                    ]
                };
            }
            return exp;
        });
        setPaper({ ...paper, experiments: updatedExperiments });
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      
      const formattedPaper = {
          ...paper,
          experiments: paper.experiments.map(exp => ({
              ...exp,
              measurements: exp.measurements.map(meas => ({
                  ...meas,
                  coordinates: `${meas.x}, ${meas.y}, ${meas.z}`, // Ensure coordinates are formatted as a string
                  regions: '' // This will be calculated on the backend
              }))
          }))
      };
  
      try {
          const response = await axios.post('http://localhost:8000/api/paper/', { paper: formattedPaper });
          console.log('Successfully submitted:', response.data);
      } catch (error) {
          console.error('Error submitting paper:', error.response.data);
      }
  };

    return (
        <div className="App">
            <h1>Paper Submission Form</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={paper.name}
                    onChange={handlePaperChange}
                    placeholder="Paper Name"
                /><br />
                <textarea
                    name="introduction"
                    value={paper.introduction}
                    onChange={handlePaperChange}
                    placeholder="Introduction"
                /><br />
                <textarea
                    name="theory"
                    value={paper.theory}
                    onChange={handlePaperChange}
                    placeholder="Theory"
                /><br />
                <textarea
                    name="summary"
                    value={paper.summary}
                    onChange={handlePaperChange}
                    placeholder="Summary"
                /><br />
                {paper.experiments.map((exp, index) => (
                    <div key={index}>
                        <h3>Experiment {index + 1}</h3>
                        <input
                            type="text"
                            name="name"
                            value={exp.name}
                            onChange={(e) => handleExperimentChange(index, e)}
                            placeholder="Name (Optional)"
                        /><br />
                        <textarea
                            name="task_context"
                            value={exp.task_context}
                            onChange={(e) => handleExperimentChange(index, e)}
                            placeholder="Task Context"
                        /><br />
                        <textarea
                            name="task"
                            value={exp.task}
                            onChange={(e) => handleExperimentChange(index, e)}
                            placeholder="Task"
                        /><br />
                        <textarea
                            name="task_explained"
                            value={exp.task_explained}
                            onChange={(e) => handleExperimentChange(index, e)}
                            placeholder="Task Explained"
                        /><br />
                        <textarea
                            name="discussion"
                            value={exp.discussion}
                            onChange={(e) => handleExperimentChange(index, e)}
                            placeholder="Discussion"
                        /><br />
                        {exp.measurements.map((meas, measIndex) => (
                            <div key={measIndex}>
                                <h4>Measurement {measIndex + 1}</h4>
                                <input
                                    type="text"
                                    name="description"
                                    value={meas.description}
                                    onChange={(e) => handleMeasurementChange(index, measIndex, e)}
                                    placeholder="Description"
                                /><br />
                                <textarea
                                    name="parameters"
                                    value={meas.parameters}
                                    onChange={(e) => handleMeasurementChange(index, measIndex, e)}
                                    placeholder="Parameters"
                                /><br />
                                <textarea
                                    name="interpretation"
                                    value={meas.interpretation}
                                    onChange={(e) => handleMeasurementChange(index, measIndex, e)}
                                    placeholder="Interpretation"
                                /><br />
                                <input
                                    type="text"
                                    name="label"
                                    value={meas.label}
                                    onChange={(e) => handleMeasurementChange(index, measIndex, e)}
                                    placeholder="Label"
                                /><br />
                                <input
                                    type="number"
                                    name="x"
                                    value={meas.x}
                                    onChange={(e) => handleMeasurementChange(index, measIndex, e)}
                                    placeholder="X Coordinate"
                                /><br />
                                <input
                                    type="number"
                                    name="y"
                                    value={meas.y}
                                    onChange={(e) => handleMeasurementChange(index, measIndex, e)}
                                    placeholder="Y Coordinate"
                                /><br />
                                <input
                                    type="number"
                                    name="z"
                                    value={meas.z}
                                    onChange={(e) => handleMeasurementChange(index, measIndex, e)}
                                    placeholder="Z Coordinate"
                                /><br />
                            </div>
                        ))}
                        <button type="button" onClick={() => addMeasurement(index)}>Add Measurement</button>
                    </div>
                ))}
                <button type="button" onClick={addExperiment}>Add More Experiments</button><br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default App;
