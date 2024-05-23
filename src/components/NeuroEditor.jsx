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

const CustomDocument = Document.extend({
  content: 'block+',
});


// Helper function to create custom paragraph nodes that accept only integers
const createIntegerParagraphNode = (name, placeholder) => {
  return Node.create({
    name: name,
    group: 'block',
    content: 'text*',
    marks: '',

    addAttributes() {
      return {
        placeholder: {
          default: placeholder,
        },
        dataType: {
          default: 'integer',
        }
      };
    },

    parseHTML() {
      return [
        {
          tag: `p[data-type="integer"]`,
          getAttrs: node => node.style && node.textContent.match(/^-?\d+$/)
        }
      ];
    },

    renderHTML({ node, HTMLAttributes }) {
      return ['p', mergeAttributes(HTMLAttributes, { 'data-placeholder': node.attrs.placeholder, 'data-type': 'integer' }), 0];
    }
  });
};

// Creating custom nodes for each measurement field
const XCoordinateParagraph = createIntegerParagraphNode('xCoordinateParagraph', 'X Coordinate');
const YCoordinateParagraph = createIntegerParagraphNode('yCoordinateParagraph', 'Y Coordinate');
const ZCoordinateParagraph = createIntegerParagraphNode('zCoordinateParagraph', 'Z Coordinate');
const BrodmannAreaParagraph = createIntegerParagraphNode('brodmannAreaParagraph', 'Brodmann Area');


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

const PaperNameParagraph = createCustomParagraphNode('paperNameParagraph', 'paperName');
const IntroductionParagraph = createCustomParagraphNode('introductionParagraph', 'introduction');
const TheoryParagraph = createCustomParagraphNode('theoryParagraph', 'theory');
const SummaryParagraph = createCustomParagraphNode('summaryParagraph', 'summary');
const PaperURLParagraph = createCustomParagraphNode('paperURLParagraph', 'paperURL');
const ExperimentNameParagraph = createCustomParagraphNode('experimentNameParagraph', 'experimentName');
const TaskContextParagraph = createCustomParagraphNode('taskContextParagraph', 'taskContext');
const TaskParagraph = createCustomParagraphNode('taskParagraph', 'task');
const TaskExplainedParagraph = createCustomParagraphNode('taskExplainedParagraph', 'taskExplained');
const DiscussionParagraph = createCustomParagraphNode('discussionParagraph', 'discussion');
const ExperimentURLParagraph = createCustomParagraphNode('experimentURLParagraph', 'experimentURL');
const MDescriptionParagraph = createCustomParagraphNode('mDescriptionParagraph', 'mDescription');
const MParametersPargarph = createCustomParagraphNode('mParametersParagraph', 'mParameters');
const MInterpretationParagraph = createCustomParagraphNode('mInterpretationParagraph', 'mInterpertation');
const MLabelParagraph = createCustomParagraphNode('mLabelParagraph', 'mLabel');

const TemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');

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
      MLabelParagraph
    ],
    content: '<p>Start writing here...</p>',
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

  const handleSave = async () => {
    if (editor) {
      const documentData = editor.getJSON();
      const method = id ? 'PUT' : 'POST';
      const url = id ? `http://localhost:8000/api/documents/${id}/` : 'http://localhost:8000/api/documents/';
      try {
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: documentData, name }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const savedData = await response.json();
        if (!id) navigate(`/editor/${savedData.unique_identifier}`, { replace: true });
        console.log("Document saved!", savedData);
      } catch (error) {
        console.error("Failed to save document:", error);
      }
    }
  };

  return (
    <div className="Tiptap">
      <div className="editor-container">
        <header className="editor-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <FiArrowLeft />
          </button>
          <input type="text" className="document-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Untitled Document" />
          <MenuBar editor={editor} handleSave={handleSave} />
        </header>
        <EditorContent editor={editor} />
        <EditorJSONPreview editor={editor} />
      </div>
    </div>
  );
};

const MenuBar = ({ editor, handleSave }) => {
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
      <button onClick={() => {
            editor.commands.addPaperNode({
              paperName: '',
              introduction: '',
              theory: '',
              summary: '',
              paperURL: ''
            });
          }}>
        Add Paper Node
      </button>
      <button onClick={() => {
            editor.commands.addMeasurementNode({
              measurementType: 'mni'
            });
          }}>
        Add MNI Node
      </button>
              

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
        Add E Node
      </button>

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
