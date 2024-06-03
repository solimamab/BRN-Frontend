// MeasurementNode.jsx
import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewRenderer } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import Component from './Component';
import { TextSelection } from '@tiptap/pm/state';

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

const MDescriptionParagraph = createCustomParagraphNode('mDescriptionParagraph', 'mDescription');
const MParametersPargarph = createCustomParagraphNode('mParametersParagraph', 'mParameters');
const mInterpretationParagraph = createCustomParagraphNode('mInterpretationParagraph', 'mInterpertation');
const MLabelParagraph = createCustomParagraphNode('mLabelParagraph', 'mLabel');



// Helper function to create custom paragraph nodes that accept only integers
const createIntegerParagraphNode = (name, dataType) => {
  return Node.create({
    name: name,
    group: 'block',
    content: 'text*',
    marks: '',

    addAttributes() {
      return {
        dataType: {
          default: dataType,
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

// Creating custom nodes for each measurement field
const XCoordinateParagraph = createIntegerParagraphNode('xCoordinateParagraph', 'xCoordinate');
const YCoordinateParagraph = createIntegerParagraphNode('yCoordinateParagraph', 'yCoordinate');
const ZCoordinateParagraph = createIntegerParagraphNode('zCoordinateParagraph', 'zCoordinate');
const BrodmannAreaParagraph = createIntegerParagraphNode('brodmannAreaParagraph', 'bArea');

// Main MeasurementNode definition
export const MeasurementNode = Node.create({
  name: 'measurementNode',
  group: 'block',
  content: 'mDescriptionParagraph mParametersParagraph mInterpretationParagraph mLabelParagraph (xCoordinateParagraph yCoordinateParagraph zCoordinateParagraph | brodmannAreaParagraph)',
  defining: true,

  addAttributes() {
    return {
      measurementType: {
        default: 'mni', // 'mni' for coordinates, 'brodmann' for Brodmann area
      },
      uuid: {
        default: null,
      }
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer((props) => <Component {...props} editor={props.editor} getPos={props.getPos} />, { contentDOMElementTag: 'measurement-node' });
  },

  parseHTML() {
    return [{ tag: 'measurement-node' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'class': 'measurement-node', 'data-measurement-type': node.attrs.measurementType }), 0];
  },

  addCommands() {
    return {
      addMeasurementNode: attributes => ({ commands }) => {
        if (attributes.measurementType === 'mni') {
          return commands.insertContent({
            type: 'measurementNode',
            attrs: { measurementType: 'mni' },
            content: [
              { type: 'mDescriptionParagraph', content: [{ type: 'text', text: 'Enter Description' }] },
              { type: 'mParametersParagraph', content: [{ type: 'text', text: 'Enter Parameters' }] },
              { type: 'mInterpretationParagraph', content: [{ type: 'text', text: 'Enter Interpretation' }] },
              { type: 'mLabelParagraph', content: [{ type: 'text', text: 'Enter Label' }] },
              { type: 'xCoordinateParagraph', content: [{ type: 'text', text: 'Enter X Coordinate' }] },
              { type: 'yCoordinateParagraph', content: [{ type: 'text', text: 'Enter Y Coordinate' }] },
              { type: 'zCoordinateParagraph', content: [{ type: 'text', text: 'Enter Z Coordinate' }] }
            ]
          });
        } else {
          return commands.insertContent({
            type: 'measurementNode',
            attrs: { measurementType: 'brodmann' },
            content: [
              { type: 'mDescriptionParagraph', content: [{ type: 'text', text: 'Enter Description' }] },
              { type: 'mParametersParagraph', content: [{ type: 'text', text: 'Enter Parameters' }] },
              { type: 'mInterpretationParagraph', content: [{ type: 'text', text: 'Enter Interpretation' }] },
              { type: 'mLabelParagraph', content: [{ type: 'text', text: 'Enter Label' }] },
              { type: 'brodmannAreaParagraph', content: [{ type: 'text', text: '0' }] }
            ]
          });
        }
      },
      toggleMeasurementType: () => ({ tr, state, commands }) => {
        const { selection } = state;
        const { node, pos } = selection;
        if (node && node.type.name === 'measurementNode') {
          const currentType = node.attrs.measurementType;
          const newType = currentType === 'mni' ? 'brodmann' : 'mni';
  
          // Ensure to pass all existing attributes and update only measurementType
          const attrs = { ...node.attrs, measurementType: newType };
  
          tr.setNodeMarkup(pos, undefined, attrs); // Apply new attributes
          return true;
        }
        return false;
      },
      setMeasurmentNodeUUID: (uuid) => ({ tr, commands }) => {
        const { doc } = tr;
        let updated = false;
        doc.descendants((node, pos) => {
          if (node.type.name === 'measurementNode') {
            const transaction = tr.setNodeMarkup(pos, null, { ...node.attrs, uuid: uuid });
            updated = true;
            return false;  // Stop iterating after finding the first paperNode
          }
          return true;
        });
        return updated;
      }
    };
  },

  addKeyboardShortcuts() {
    return {
      ArrowDown: () => {
        const { state, view } = this.editor;
        const { $head } = state.selection;
  
        // Check if the selection is at the end of the paperURLParagraph
        if ($head.parent.type.name === 'brodmannAreaParagraph' && $head.pos === $head.end()) {
          const endPos = $head.pos + 1; // Move beyond the paperURLParagraph
          const tr = state.tr;
  
          // Check for the node after and insert paragraph if it's not there
          if (!$head.nodeAfter || $head.nodeAfter.type.name !== 'paragraph') {
            const paragraphNode = state.schema.nodes.paragraph.createAndFill();
            tr.insert(endPos, paragraphNode);
            tr.setSelection(TextSelection.near(tr.doc.resolve(endPos + 1))); // Create selection near the start of the new paragraph
            view.dispatch(tr);
            return true; // This stops further handling of this keydown event
          }
        } else if ($head.parent.type.name === 'zCoordinateParagraph' && $head.pos === $head.end()) {
          const endPos = $head.pos + 1; // Move beyond the paperURLParagraph
          const tr = state.tr;
  
          // Check for the node after and insert paragraph if it's not there
          if (!$head.nodeAfter || $head.nodeAfter.type.name !== 'paragraph') {
            const paragraphNode = state.schema.nodes.paragraph.createAndFill();
            tr.insert(endPos, paragraphNode);
            tr.setSelection(TextSelection.near(tr.doc.resolve(endPos + 1))); // Create selection near the start of the new paragraph
            view.dispatch(tr);
            return true; // This stops further handling of this keydown event
          }
        }
        return false; // Allows other keydown handlers to execute
      }
    };
  }
});