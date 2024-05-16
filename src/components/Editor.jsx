import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import '../styles.scss'; 

const Editor = () => {
    const { id } = useParams(); // Get document ID from URL
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [name, setName] = useState('');  // New state for document name

    // Initialize the editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Color.configure({ types: [TextStyle.name, ListItem.name] }),
            TextStyle.configure({ types: [ListItem.name] })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getJSON());
        }
    });

    // Effect to fetch document content from the backend
    useEffect(() => {
        if (editor && id) { // Ensure editor and id exist
            fetch(`http://localhost:8000/api/documents/${id}/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch document');
                    }
                    return response.json();
                })
                .then(data => {
                    if (editor && data.content) {
                        editor.commands.setContent(data.content);
                    }
                    if (data.name) {
                        setName(data.name);  // Set document name
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

    // Ensure editor is not null before rendering EditorContent
    if (!editor) {
        return <div>Loading...</div>;
    }

    return (
        <div className="Tiptap">
            <div>
                <label>
                    Document Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
            </div>
            <MenuBar editor={editor} handleSave={handleSave} />
            <EditorContent editor={editor} />
        </div>
    );
};


const MenuBar = ({ editor, handleSave }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="Tiptap">
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
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
            >
                h4
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
            >
                h5
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
            >
                h6
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
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
            >
                blockquote
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                horizontal rule
            </button>
            <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                hard break
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
            <button
                onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
            >
                purple
            </button>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default Editor;
