import React from 'react';
import { useEditor } from '@tiptap/react';

const EditorJSONPreview = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <pre style={{ marginTop: '1em', padding: '1em', background: 'black', borderRadius: '5px' }}>
      {JSON.stringify(editor.getJSON(), null, 2)}
    </pre>
  );
};

export default EditorJSONPreview;