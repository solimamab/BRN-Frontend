import React from 'react';
import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './MenuBar';
import '../styles.scss'; // Assuming you have styling for MenuBar and editor

// define your extension array
const extensions = [
  StarterKit,
]

const content = '<p>Hello World!</p>'

const Tiptap = () => {
  return (
    <EditorProvider   extensions={extensions} content={content} slotBefore={<MenuBar />} >{/* slot after would go right there*/}
      <FloatingMenu>This is the floating menu</FloatingMenu>
      <BubbleMenu>This is the bubble menu</BubbleMenu>
    </EditorProvider>
  );
}

export default Tiptap;