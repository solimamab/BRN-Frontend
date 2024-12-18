import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import { Node, mergeAttributes } from '@tiptap/core';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { FiArrowLeft } from 'react-icons/fi';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '../extensions/FontSize'; // Ensure this extension is imported
import { PaperNode } from '../extensions/PaperNode'; // Import the form node extension
import '../styles.scss';
import EditorJSONPreview from './EditorJSONPreview'; // Import JSON preview component
import { ExperimentNode } from '../extensions/ExperimentNode'; // Import the form node extension } from '../extensions/ExperimentNode';
import { MeasurementNode } from '../extensions/MeasurementNode'; // Import the MeasurementNode
import { FloatingMenu } from '@tiptap/react'; // Make sure the path is correct and the component exists in this path
import { PluginKey } from '@tiptap/pm/state';

const CustomDocument = Document.extend({
  content: 'block+',
});


// Helper function to create custom paragraph nodes that accept only integers
const createIntegerParagraphNode = (name, dataType) => {
  return Node.create({
    name: name,
    group: 'block',
    content: 'text*',
    marks: '',

    addAttributes() {
      return {
        dataType: {
          default: dataType,
        }
      };
    },

    parseHTML() {
      return [{ tag: `p[data-type="${dataType}"]` }];
    },
    renderHTML({ node, HTMLAttributes }) {
      return ['p', mergeAttributes(HTMLAttributes, {'data-type': dataType}), 0];
    }
  });
};


const XCoordinateParagraph = createIntegerParagraphNode('xCoordinateParagraph', 'xCoordinate');
const YCoordinateParagraph = createIntegerParagraphNode('yCoordinateParagraph', 'yCoordinate');
const ZCoordinateParagraph = createIntegerParagraphNode('zCoordinateParagraph', 'zCoordinate');
const BrodmannAreaParagraph = createIntegerParagraphNode('brodmannAreaParagraph', 'bArea');


const createCustomParagraphNode = (name, dataType) => {
  return Node.create({
    name: name,
    group: 'block',
    content: 'text*',
    addAttributes() {
      return {
        dataType: {
          default: dataType
        }
      };
    },
    parseHTML() {
      return [{ tag: `p[data-type="${dataType}"]` }];
    },
    renderHTML({ node, HTMLAttributes }) {
      return ['p', mergeAttributes(HTMLAttributes, {'data-type': dataType}), 0];
    }
  });
};

const createURLParagraphNode = (name, dataType) => {
  return Node.create({
    name: name,
    group: 'block',
    content: 'text*',
    addAttributes() {
      return {
        dataType: {
          default: dataType
        }
      };
    },
    parseHTML() {
      return [{ tag: `p[data-type="${dataType}"]` }];
    },
    renderHTML({ node, HTMLAttributes }) {
      return ['p', mergeAttributes(HTMLAttributes, {'data-type': dataType}), 0];
    }
  });
};

const PaperNameParagraph = createCustomParagraphNode('paperNameParagraph', 'paperName');
const IntroductionParagraph = createCustomParagraphNode('introductionParagraph', 'introduction');
const TheoryParagraph = createCustomParagraphNode('theoryParagraph', 'theory');
const SummaryParagraph = createCustomParagraphNode('summaryParagraph', 'summary');
const PaperURLParagraph = createURLParagraphNode('paperURLParagraph', 'paperURL');
const ExperimentNameParagraph = createCustomParagraphNode('experimentNameParagraph', 'experimentName');
const TaskContextParagraph = createCustomParagraphNode('taskContextParagraph', 'taskContext');
const TaskParagraph = createCustomParagraphNode('taskParagraph', 'task');
const TaskExplainedParagraph = createCustomParagraphNode('taskExplainedParagraph', 'taskExplained');
const DiscussionParagraph = createCustomParagraphNode('discussionParagraph', 'discussion');
const ExperimentURLParagraph = createURLParagraphNode('experimentURLParagraph', 'experimentURL');
const MDescriptionParagraph = createCustomParagraphNode('mDescriptionParagraph', 'mDescription');
const MParametersPargarph = createCustomParagraphNode('mParametersParagraph', 'mParameters');
const MInterpretationParagraph = createCustomParagraphNode('mInterpretationParagraph', 'mInterpertation');
const MLabelParagraph = createCustomParagraphNode('mLabelParagraph', 'mLabel');

const initialContent = {
  type: 'doc',
  content: [
    {
      type: 'paperNode',
      content: [
        { type: 'paperNameParagraph', content: [{ type: 'text', text: ' ' }] },
        { type: 'introductionParagraph', content: [{ type: 'text', text: ' ' }] },
        { type: 'theoryParagraph', content: [{ type: 'text', text: ' ' }] },
        { type: 'summaryParagraph', content: [{ type: 'text', text: ' ' }] },
        { type: 'paperURLParagraph', content: [{ type: 'text', text: ' ' }] }
      ]
    }
  ]
};


const TemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isNameChanged, setIsNameChanged] = useState(false); // Track if the name has changed


  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily.configure({ types: ['textStyle'] }),
      FontSize,
      PaperNode,
      PaperNameParagraph,
      IntroductionParagraph,
      TheoryParagraph,
      SummaryParagraph,
      PaperURLParagraph,
      ExperimentNode,
      ExperimentNameParagraph,
      TaskContextParagraph,
      TaskParagraph,
      TaskExplainedParagraph,
      DiscussionParagraph,
      ExperimentURLParagraph,
      MeasurementNode,
      XCoordinateParagraph,
      YCoordinateParagraph,
      ZCoordinateParagraph,
      BrodmannAreaParagraph,
      MDescriptionParagraph,
      MParametersPargarph,
      MInterpretationParagraph,
      MLabelParagraph,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      handleSave();
    }
  });

  useEffect(() => {
    if (editor && id) {
      fetch(`http://localhost:8000/api/documents/${id}/`)
        .then(response => response.json())
        .then(data => {
          if (editor && data.content) {
            editor.commands.setContent(data.content);
          }
          setName(data.name);
        })
        .catch(error => console.error('Failed to load document:', error));
    }
  }, [id, editor]);

  useEffect(() => {
    // Check if name has changed
    if (isNameChanged) {
      handleSave();
    }
  }, [isNameChanged]);

  const checkForDuplicateNodes = () => {
    const experimentNodes = [];
    const measurementNodes = [];
  
    editor.view.state.doc.descendants((node, pos) => {
      if (node.type.name === 'experimentNode') {
        const experimentContents = extractExperimentContents(node);
        if (isDuplicateNode(experimentContents, experimentNodes)) {
          throw new Error('Duplicate Experiment Node detected. Please remove or modify the duplicate experiment entries before proceeding.');
        }
        experimentNodes.push(experimentContents);
      } else if (node.type.name === 'measurementNode') {
        const measurementContents = extractMeasurementContents(node);
        if (isDuplicateNode(measurementContents, measurementNodes)) {
          throw new Error('Duplicate Measurement Node detected. Please remove or modify the duplicate measurement entries before proceeding.');
        }
        measurementNodes.push(measurementContents);
      }
    });
  };
  
  const extractExperimentContents = (node) => {
    const contents = {
      experimentNameText: '',
      taskContextText: '',
      taskText: '',
      taskExplainedText: '',
      discussionText: ''
    };
    node.content.forEach(child => {
      const textContent = child.textContent.trim();
      switch (child.type.name) {
        case 'experimentNameParagraph':
          contents.experimentNameText = textContent;
          break;
        case 'taskContextParagraph':
          contents.taskContextText = textContent;
          break;
        case 'taskParagraph':
          contents.taskText = textContent;
          break;
        case 'taskExplainedParagraph':
          contents.taskExplainedText = textContent;
          break;
        case 'discussionParagraph':
          contents.discussionText = textContent;
          break;
      }
    });
    return contents;
  };
  
  const extractMeasurementContents = (node) => {
    const contents = {
      descriptionText: '',
      parametersText: '',
      interpretationText: ''
    };
    node.content.forEach(child => {
      const textContent = child.textContent.trim();
      switch (child.type.name) {
        case 'mDescriptionParagraph':
          contents.descriptionText = textContent;
          break;
        case 'mParametersParagraph':
          contents.parametersText = textContent;
          break;
        case 'mInterpretationParagraph':
          contents.interpretationText = textContent;
          break;
      }
    });
    return contents;
  };
  
  const isDuplicateNode = (newNode, nodeList) => {
    return nodeList.some(node => Object.keys(node).every(key => node[key] === newNode[key]));
  };
  


  const handleSave = async () => {
    if (editor) {
      const documentData = editor.getJSON();
      const method = id ? 'PUT' : 'POST';
      const templateName = 'neuro1'; // Hardcoded template name for this editor


      const url = id ? `http://localhost:8000/api/documents/${id}/` : 'http://localhost:8000/api/documents/';
      try {
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: documentData, name, template: templateName }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const savedData = await response.json();
        if (!id) navigate(`/neuro1/${savedData.unique_identifier}`, { replace: true });
      } catch (error) {
        console.error("Failed to save document:", error);
      }
      setIsNameChanged(false); // Reset the flag after saving
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setIsNameChanged(true); // Set the flag when name changes
  };



  const handleParse = async () => {
    try {
      checkForDuplicateNodes(); // Check for duplicates before parsing
      const metadata = await fetchMetadata();
      const documentData = editor.getJSON(); // Define documentData here, right after metadata fetch
      if (metadata) {
        const currentUUIDs = extractUUIDsFromDocument(documentData);
        const metadataUUIDs = extractUUIDsFromMetadata(metadata);
  
        // Find UUIDs in metadata not present in the current document
        const deletedUUIDs = metadataUUIDs.filter(uuid => !currentUUIDs.includes(uuid));
  
        for (let uuid of deletedUUIDs) {
          await deleteNode(uuid, determineNodeType(uuid, metadata));
        }
      }
  
      // Continue with normal parsing as no deletions or deletions are handled
      const response = await fetch('http://localhost:8000/api/documents/parse/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: documentData, uuid: id }) // documentData is now defined
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const savedData = await response.json();
      console.log("Document parsed successfully!", savedData);
      await fetchAndUpdateMetadata();
    } catch (error) {
      console.error("Failed to parse document:", error);
      alert("Failed to parse document: " + error.message);  // Using alert to notify the user
    }
  };
  
  const fetchMetadata = async () => {
    const url = `http://localhost:8000/api/documents/metadata/${id}/`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch document metadata:", error);
      return null;
    }
  };
  
  const extractUUIDsFromDocument = (documentData) => {
    const uuids = [];
    const extract = (content) => {
      if (content.attrs && content.attrs.uuid) {
        uuids.push(content.attrs.uuid);
      }
      if (content.content) {
        content.content.forEach(extract);
      }
    };
    extract(documentData);
    return uuids;
  };
  
  const extractUUIDsFromMetadata = (metadata) => {
    const uuids = [];
    if (metadata.paper) {
      uuids.push(metadata.paper.unique_identifier);
      metadata.paper.experiments.forEach(exp => {
        uuids.push(exp.unique_identifier);
        exp.measurements.forEach(meas => uuids.push(meas.unique_identifier));
      });
    }
    return uuids;
  };
  
  const determineNodeType = (uuid, metadata) => {
    if (metadata.paper && metadata.paper.unique_identifier === uuid) {
      return 'paper';
    }
    let type = '';
    metadata.paper.experiments.forEach(exp => {
      if (exp.unique_identifier === uuid) {
        type = 'experiment';
      }
      exp.measurements.forEach(meas => {
        if (meas.unique_identifier === uuid) {
          type = 'measurement';
        }
      });
    });
    return type;
  };
  
  const deleteNode = async (uuid, nodeType) => {
    const url = new URL(`http://localhost:8000/api/documents/node-management/${uuid}/`);
    url.search = new URLSearchParams({ type: nodeType }).toString();
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(`Node ${uuid} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete node:", error);
    }
  };

  const fetchAndUpdateMetadata = async () => {
    const url = `http://localhost:8000/api/documents/metadata/${id}/`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const metadata = await response.json();
        console.log("Fetched Metadata: ", metadata); // Check the actual structure

        updateNodesWithUUIDs(metadata);
    } catch (error) {
        console.error("Failed to fetch document metadata:", error);
    }
  };

  const updateNodesWithUUIDs = (metadata) => {
    console.log("Starting to update nodes with UUIDs...");
    console.log("Metadata received:", JSON.stringify(metadata, null, 2));

    const usedUUIDs = new Set(); // To track UUIDs that have been assigned

    editor.view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'paperNode' && metadata.paper) {
            const paperContents = {
                paperNameNodeText: '',
                paperIntroductionNodeText: '',
                paperTheoryNodeText: '',
                paperSummaryNodeText: '',
                paperURLNodeText: ''
            };

            node.content.forEach(child => {
                const textContent = typeof child.textContent === 'string' ? child.textContent.trim() : '';
                switch (child.type.name) {
                    case 'paperNameParagraph':
                        paperContents.paperNameNodeText = textContent;
                        break;
                    case 'introductionParagraph':
                        paperContents.paperIntroductionNodeText = textContent;
                        break;
                    case 'theoryParagraph':
                        paperContents.paperTheoryNodeText = textContent;
                        break;
                    case 'summaryParagraph':
                        paperContents.paperSummaryNodeText = textContent;
                        break;
                    case 'paperURLParagraph':
                        paperContents.paperURLNodeText = textContent;
                        break;
                }
            });

            if (matchPaperNode(paperContents, metadata.paper) && !usedUUIDs.has(metadata.paper.unique_identifier)) {
                editor.commands.setPaperNodeUUID(metadata.paper.unique_identifier, pos);
                usedUUIDs.add(metadata.paper.unique_identifier);
                console.log(`Assigned UUID ${metadata.paper.unique_identifier} to paperNode.`);
            }
        } else if (node.type.name === 'experimentNode' && metadata.paper.experiments) {
            metadata.paper.experiments.forEach(exp => {
                const experimentContents = {
                    experimentNameText: '',
                    taskContextText: '',
                    taskText: '',
                    taskExplainedText: '',
                    discussionText: ''
                };

                node.content.forEach(child => {
                    const textContent = typeof child.textContent === 'string' ? child.textContent.trim() : '';
                    switch (child.type.name) {
                        case 'experimentNameParagraph':
                            experimentContents.experimentNameText = textContent;
                            break;
                        case 'taskContextParagraph':
                            experimentContents.taskContextText = textContent;
                            break;
                        case 'taskParagraph':
                            experimentContents.taskText = textContent;
                            break;
                        case 'taskExplainedParagraph':
                            experimentContents.taskExplainedText = textContent;
                            break;
                        case 'discussionParagraph':
                            experimentContents.discussionText = textContent;
                            break;
                    }
                });

                if (matchExperimentNode(experimentContents, exp) && !usedUUIDs.has(exp.unique_identifier)) {
                    editor.commands.setExperimentNodeUUID(exp.unique_identifier, pos);
                    usedUUIDs.add(exp.unique_identifier);
                    console.log(`Assigned UUID ${exp.unique_identifier} to experimentNode.`);
                }
            });
        } else if (node.type.name === 'measurementNode' && metadata.paper.experiments) {
            metadata.paper.experiments.forEach(exp => {
                exp.measurements.forEach(meas => {
                    const measurementContents = {
                        descriptionText: '',
                        parametersText: '',
                        interpretationText: ''
                    };

                    node.content.forEach(child => {
                        const textContent = typeof child.textContent === 'string' ? child.textContent.trim() : '';
                        switch (child.type.name) {
                            case 'mDescriptionParagraph':
                                measurementContents.descriptionText = textContent;
                                break;
                            case 'mParametersParagraph':
                                measurementContents.parametersText = textContent;
                                break;
                            case 'mInterpretationParagraph':
                                measurementContents.interpretationText = textContent;
                                break;
                        }
                    });

                    if (matchMeasurementNode(measurementContents, meas) && !usedUUIDs.has(meas.unique_identifier)) {
                        editor.commands.setMeasurementNodeUUID(meas.unique_identifier, pos);
                        usedUUIDs.add(meas.unique_identifier);
                        console.log(`Assigned UUID ${meas.unique_identifier} to measurementNode.`);
                    }
                });
            });
        }
    });
    console.log("Finished processing nodes. Used UUIDs:", Array.from(usedUUIDs));
};
  



  function matchPaperNode(paperContents, paperData) {
    console.log(`Comparing document text with Paper Name: '${paperData.name}', and '${paperContents.paperNameNodeText}' Result: ${fieldMatch(paperContents.paperNameNodeText, paperData.name)}`);
    console.log(`Comparing document text with Introduction: '${paperData.introduction}', and '${paperContents.paperIntroductionNodeText}' Result: ${fieldMatch(paperContents.paperIntroductionNodeText, paperData.introduction)}`);
    console.log(`Comparing document text with Theory: '${paperData.theory}', and '${paperContents.paperTheoryNodeText}' Result: ${fieldMatch(paperContents.paperTheoryNodeText, paperData.theory)}`);
    console.log(`Comparing document text with Summary: '${paperData.summary}', and '${paperContents.paperSummaryNodeText}' Result: ${fieldMatch(paperContents.paperSummaryNodeText, paperData.summary)}`);
    console.log(`Comparing document text with URL: '${paperData.url}', and '${paperContents.paperURLNodeText}' Result: ${fieldMatch(paperContents.paperURLNodeText, paperData.url)}`);
  
    return (
      fieldMatch(paperContents.paperNameNodeText, paperData.name) &&
      fieldMatch(paperContents.paperIntroductionNodeText, paperData.introduction) &&
      (paperData.theory === '' || fieldMatch(paperContents.paperTheoryNodeText, paperData.theory)) &&
      fieldMatch(paperContents.paperSummaryNodeText, paperData.summary) &&
      fieldMatch(paperContents.paperURLNodeText, paperData.url)
    );
  }

  function matchExperimentNode(experimentContents, experimentData) {
      return fieldMatch(experimentContents.experimentNameText, experimentData.name) &&
            fieldMatch(experimentContents.taskContextText, experimentData.task_context) &&
            fieldMatch(experimentContents.taskText, experimentData.task) &&
            fieldMatch(experimentContents.taskExplainedText, experimentData.task_explained) &&
            fieldMatch(experimentContents.discussionText, experimentData.discussion);
  }

  function matchMeasurementNode(measurementContents, measurementData) {
      return fieldMatch(measurementContents.descriptionText, measurementData.description) &&
            fieldMatch(measurementContents.parametersText, measurementData.parameters) &&
            fieldMatch(measurementContents.interpretationText, measurementData.interpretation);
  }

  function fieldMatch(nodeText, field) {
    // Ensure both nodeText and field are strings
    const cleanNodeText = typeof nodeText === 'string' ? nodeText.trim() : '';
    const cleanField = typeof field === 'string' ? field.trim() : '';
  
    const isNodeTextEmpty = !cleanNodeText || cleanNodeText === ' ';
    const isFieldEmpty = !cleanField || cleanField === ' ';
  
    if (isNodeTextEmpty && isFieldEmpty) {
      return true;
    } else if (!isNodeTextEmpty && !isFieldEmpty) {
      return cleanNodeText.includes(cleanField);
    } else {
      return false;
    }
  }

  return (
    <div className="Tiptap">
      <div className="editor-container">
        <header className="editor-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <FiArrowLeft />
          </button>
          <input type="text" className="document-name" value={name} onChange={handleNameChange} placeholder="Untitled Document" />
          <MenuBar editor={editor} handleSave={handleSave} handleParse={handleParse} />
        </header>
          <FloatMenu editor={editor} />
        <EditorContent editor={editor} />
        <EditorJSONPreview editor={editor} />
      </div>
    </div>
  );
};


const FloatMenu = ({ editor }) => {
  const [hasExperimentNode, setHasExperimentNode] = useState(false);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updateState = () => {
      const doc = editor.state.doc;
      let foundExperimentNode = false;
      doc.descendants((node) => {
        if (node.type.name === 'experimentNode') {
          foundExperimentNode = true;
        }
      });
      setHasExperimentNode(foundExperimentNode);
    };

    // Add the update listener
    updateState(); // Call immediately to set initial state
    const onUpdate = editor.on('update', updateState);

    // Return a cleanup function
    return () => {
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(); // If onUpdate is a function, it's likely the unsubscribe function
      } else {
        // If TipTap doesn't provide an unsubscribe function, manually remove the listener
        editor.off('update', updateState);
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="menu-bar">
        {hasExperimentNode && (
          <button onClick={() => {
            editor.commands.addMeasurementNode({
              measurementType: 'mni'
            });
          }}>
            Add Measurement
          </button>
        )}
        <button onClick={() => {
          editor.commands.addExperimentNode({
            experimentName: '',
            taskContext: '',
            task: '',
            taskExplained: '',
            discussion: '',
            experimentURL: ''
          });
        }}>
          Add Experiment
        </button>
      </div>
    </FloatingMenu>
  );
};

const MenuBar = ({ editor, handleSave, handleParse }) => {
  if (!editor) {
    return null;
  }

  const setFontSize = (size) => {
    editor.chain().focus().setFontSize(size).run();
  };

  const setFontFamily = (font) => {
    editor.chain().focus().setFontFamily(font).run();
  };


  
  return (
    <div className="menu-bar">
      
      <button onClick={handleParse}>Parse</button>

      <select className="menu-select" onChange={(e) => setFontSize(e.target.value)} defaultValue="16">
        <option value="12">12pt</option>
        <option value="14">14pt</option>
        <option value="16">16pt</option>
        <option value="18">18pt</option>
        <option value="24">24pt</option>
      </select>

      <select className="menu-select" onChange={(e) => setFontFamily(e.target.value)} defaultValue="Arial">
        <option value="Arial">Arial</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
      </select>

      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
        Bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
        Italic
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
        Strike
      </button>
      <button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}>
        Code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        Clear Marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        Clear Nodes
      </button>
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
        Paragraph
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
        H1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
        H2
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
        H3
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
        Bullet List
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
        Ordered List
      </button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>
        Code Block
      </button>
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
        Undo
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
        Redo
      </button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default TemplateEditor;
