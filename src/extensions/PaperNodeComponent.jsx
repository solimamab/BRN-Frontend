import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const PaperNodeComponent = ({ node, children }) => {
  const isProcessed = node.attrs.uuid !== null;

  return (
    <NodeViewWrapper className={`paper-node ${isProcessed ? 'processed' : 'unprocessed'}`}>
      <div className="status-label">{isProcessed ? 'Processed' : 'Unprocessed'}</div>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default PaperNodeComponent;