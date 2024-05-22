// MeasurementNode.jsx
import { Node, mergeAttributes } from '@tiptap/core';

// Helper function to create custom paragraph nodes that accept only integers
const createIntegerParagraphNode = (name, placeholder) => {
  return Node.create({
    name: name,
    group: 'block',
    content: 'text*',
    marks: '',

    addAttributes() {
      return {
        placeholder: {
          default: placeholder,
        },
        dataType: {
          default: 'integer',
        }
      };
    },

    parseHTML() {
      return [
        {
          tag: `p[data-type="integer"]`,
          getAttrs: node => node.style && node.textContent.match(/^-?\d+$/)
        }
      ];
    },

    renderHTML({ node, HTMLAttributes }) {
      return ['p', mergeAttributes(HTMLAttributes, { 'data-placeholder': node.attrs.placeholder, 'data-type': 'integer' }), 0];
    }
  });
};

// Creating custom nodes for each measurement field
const XCoordinateParagraph = createIntegerParagraphNode('xCoordinateParagraph', 'X Coordinate');
const YCoordinateParagraph = createIntegerParagraphNode('yCoordinateParagraph', 'Y Coordinate');
const ZCoordinateParagraph = createIntegerParagraphNode('zCoordinateParagraph', 'Z Coordinate');
const BrodmannAreaParagraph = createIntegerParagraphNode('brodmannAreaParagraph', 'Brodmann Area');

// Main MeasurementNode definition
export const MeasurementNode = Node.create({
  name: 'measurementNode',
  group: 'block',
  content: '(xCoordinateParagraph yCoordinateParagraph zCoordinateParagraph) | brodmannAreaParagraph',
  defining: true,

  addAttributes() {
    return {
      measurementType: {
        default: 'mni', // 'mni' for coordinates, 'brodmann' for Brodmann area
      }
    };
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
              { type: 'xCoordinateParagraph', content: [{ type: 'text', text: '0' }] },
              { type: 'yCoordinateParagraph', content: [{ type: 'text', text: '0' }] },
              { type: 'zCoordinateParagraph', content: [{ type: 'text', text: '0' }] }
            ]
          });
        } else {
          return commands.insertContent({
            type: 'measurementNode',
            attrs: { measurementType: 'brodmann' },
            content: [
              { type: 'brodmannAreaParagraph', content: [{ type: 'text', text: '0' }] }
            ]
          });
        }
      },
      toggleMeasurementType: () => ({ state, commands }) => {
        const { tr, selection } = state;
        const { node, pos } = selection;
  
        if (node && node.type.name === 'measurementNode') {
          const currentType = node.attrs.measurementType;
          const newType = currentType === 'mni' ? 'brodmann' : 'mni';
  
          // Switch the content type based on the toggle
          const newContent = newType === 'mni' ?
            [
              { type: 'xCoordinateParagraph', content: [{ type: 'text', text: node.firstChild.textContent }] },
              { type: 'yCoordinateParagraph', content: [{ type: 'text', text: node.firstChild.nextSibling.textContent }] },
              { type: 'zCoordinateParagraph', content: [{ type: 'text', text: node.lastChild.textContent }] }
            ] : 
            [
              { type: 'brodmannAreaParagraph', content: [{ type: 'text', text: node.firstChild.textContent }] }
            ];
  
          // Replace the current node with new content and type
          tr.setNodeMarkup(pos, undefined, { measurementType: newType }, newContent);
          commands.setContent(tr.doc); // Reset the document content
          return true;
        }
        return false;
      }
    };
  },
});