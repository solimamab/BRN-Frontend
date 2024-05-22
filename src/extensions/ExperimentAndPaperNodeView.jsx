// ExperimentAndPaperNodeView.jsx
import React from 'react';
import { NodeViewWrapper, NodeViewContent, useEditor } from '@tiptap/react';

const ExperimentAndPaperNodeView = ({ node, getPos }) => {
  const editor = useEditor();

  const addMeasurement = () => {
    const measurementNode = {
      type: 'measurementNode',
      attrs: {
        description: '',
        parameters: '',
        interpretation: '',
        label: '',
        x: '',
        y: '',
        z: '',
        brodmann_area: '',
        show_brodmann: false
      },
      content: [
        { type: 'text', text: 'New Measurement' }
      ]
    };
    editor.commands.insertContent(measurementNode);
  };

  const toggleBrodmann = () => {
    const pos = getPos();
    const nodeSize = node.nodeSize;
    const currentNode = editor.state.doc.nodeAt(pos);
    
    if (currentNode && currentNode.type.name === 'measurementNode') {
      const newAttrs = {
        ...currentNode.attrs,
        show_brodmann: !currentNode.attrs.show_brodmann
      };
      editor.commands.setNodeAttributes(pos, newAttrs);
    }
  };

  return (
    <NodeViewWrapper className="experiment-paper-node">
      <div className="node-controls">
        <button onClick={addMeasurement}>Add Measurement</button>
        {node.type.name === 'measurementNode' && (
          <button onClick={toggleBrodmann}>Toggle Brodmann/MNI</button>
        )}
      </div>
      <NodeViewContent as="div" />
    </NodeViewWrapper>
  );
};

export default ExperimentAndPaperNodeView;