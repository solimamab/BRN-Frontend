import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
 
const Component = ({ node, editor, updateAttributes, getPos }) => {
  const toggleMeasurementType = () => {
    const currentType = node.attrs.measurementType;
    const newType = currentType === 'mni' ? 'brodmann' : 'mni';
    const pos = getPos();

    // Define the content based on the type
    const content = newType === 'mni' ? [
      editor.schema.nodes.mDescriptionParagraph.createAndFill({}, editor.schema.text('Enter Description')),
      editor.schema.nodes.mParametersParagraph.createAndFill({}, editor.schema.text('Enter Parameters')),
      editor.schema.nodes.mInterpretationParagraph.createAndFill({}, editor.schema.text('Enter Interpretation')),
      editor.schema.nodes.mLabelParagraph.createAndFill({}, editor.schema.text('Enter Label')),
      editor.schema.nodes.xCoordinateParagraph.createAndFill({}, editor.schema.text('Enter X')),
      editor.schema.nodes.yCoordinateParagraph.createAndFill({}, editor.schema.text('Enter Y')),
      editor.schema.nodes.zCoordinateParagraph.createAndFill({}, editor.schema.text('Enter Z'))
    ] : [
      editor.schema.nodes.mDescriptionParagraph.createAndFill({}, editor.schema.text('Enter Description')),
      editor.schema.nodes.mParametersParagraph.createAndFill({}, editor.schema.text('Enter Parameters')),
      editor.schema.nodes.mInterpretationParagraph.createAndFill({}, editor.schema.text('Enter Interpretation')),
      editor.schema.nodes.mLabelParagraph.createAndFill({}, editor.schema.text('Enter Label')),
      editor.schema.nodes.brodmannAreaParagraph.createAndFill({}, editor.schema.text('Enter Brodmann Area'))
    ];

    // Create a new node with the toggled type
    const newNode = node.type.create({ measurementType: newType }, content);

    // Replace the old node with the new node in the transaction
    editor.view.dispatch(
      editor.view.state.tr.replaceWith(pos, pos + node.nodeSize, newNode)
    );
  };

  return (
    <NodeViewWrapper className="react-component-with-content">
      <NodeViewContent className="content" />
      <button onClick={toggleMeasurementType}>
        Toggle Measurement Type
      </button>
    </NodeViewWrapper>
  );
};

export default Component;