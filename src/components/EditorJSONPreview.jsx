import React from 'react';
import { useEditor } from '@tiptap/react';

const EditorJSONPreview = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <pre>
      {JSON.stringify(editor.getJSON(), null, 2)}
    </pre>
  );
};

export default EditorJSONPreview;