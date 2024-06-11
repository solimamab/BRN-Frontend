import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const ExperimentNodeComponent = ({ node }) => {
  const isProcessed = node.attrs.uuid !== null;

  return (
    <NodeViewWrapper className={`experiment-node ${isProcessed ? 'processed' : 'unprocessed'}`}>
      <div className="status-label">{isProcessed ? 'Processed' : 'Unprocessed'}</div>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default ExperimentNodeComponent;
