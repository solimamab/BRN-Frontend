import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { FiArrowLeft } from 'react-icons/fi';
import FontSize from '../extensions/FontSize'; // Import the new extension
import EditorJSONPreview from './EditorJSONPreview'; // Import JSON preview component
import '../styles.scss';

const CustomDocument = Document.extend({
  content: 'block+',
});

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [name, setName] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle, // Ensure TextStyle is included
      FontFamily.configure({ types: ['textStyle'] }),
      FontSize,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
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
          if (data.name) {
            setName(data.name);
          }
        })
        .catch(error => {
          console.error('Failed to load document:', error);
          if (editor) {
            editor.commands.clearContent();
          }
        });
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
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: documentData, name })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const savedData = await response.json();
        if (!id) {
          navigate(`/editor/${savedData.unique_identifier}`, { replace: true });
        }
        console.log("Document saved!", savedData);
      } catch (error) {
        console.error("Failed to save document:", error);
      }
    }
  };

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Tiptap">
      <div className="editor-container">
        <header className="editor-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <FiArrowLeft />
          </button>
          <input
            type="text"
            className="document-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Untitled Document"
          />
          <MenuBar editor={editor} handleSave={handleSave} />
        </header>
        <EditorContent editor={editor} />
        <EditorJSONPreview editor={editor} /> {/* Pass editor as a prop */}
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
      <select onChange={(e) => setFontSize(e.target.value)} defaultValue="16">
        <option value="12">12pt</option>
        <option value="14">14pt</option>
        <option value="16">16pt</option>
        <option value="18">18pt</option>
        <option value="24">24pt</option>
      </select>

      <select onChange={(e) => setFontFamily(e.target.value)} defaultValue="Arial">
        <option value="Arial">Arial</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
      </select>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Editor;