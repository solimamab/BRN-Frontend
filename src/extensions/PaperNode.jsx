import { Node, mergeAttributes } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { NodeViewRenderer } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import PaperNodeComponent from './PaperNodeComponent';

// Helper function to create custom paragraph nodes
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

// Creating custom nodes for each section of the PaperNode
const PaperNameParagraph = createCustomParagraphNode('paperNameParagraph', 'paperName');
const IntroductionParagraph = createCustomParagraphNode('introductionParagraph', 'introduction');
const TheoryParagraph = createCustomParagraphNode('theoryParagraph', 'theory');
const SummaryParagraph = createCustomParagraphNode('summaryParagraph', 'summary');
const PaperURLParagraph = createCustomParagraphNode('paperURLParagraph', 'paperURL');

// Defining the main PaperNode that uses these custom paragraphs
export const PaperNode = Node.create({
  name: 'paperNode',
  group: 'block',
  content: 'paperNameParagraph introductionParagraph theoryParagraph summaryParagraph paperURLParagraph',

  
  addAttributes() {
    return {
      uuid: {
        default: null // UUID will be null for new nodes initially
      }
    };
  },

  parseHTML() {
    return [{ tag: 'paper-node' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {'class': 'paper-node'}), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PaperNodeComponent);
  },

  addCommands() {
    return {
      addPaperNode: attributes => ({ commands }) => {
        return commands.insertContent({
          type: 'paperNode',
          attrs: attributes,
          content: [
            { type: 'paperNameParagraph', content: [{ type: 'text', text: attributes.paperName || "Paper Name" }] },
            { type: 'introductionParagraph', content: [{ type: 'text', text: attributes.introduction || "Introduction" }] },
            { type: 'theoryParagraph', content: [{ type: 'text', text: attributes.theory || "Theory" }] },
            { type: 'summaryParagraph', content: [{ type: 'text', text: attributes.summary || "Summary" }] },
            { type: 'paperURLParagraph', content: [{ type: 'text', text: attributes.paperURL || "http://example.com" }] },
          ],
        });
      },
      setPaperNodeUUID: (uuid) => ({ tr, commands }) => {
        const { doc } = tr;
        let updated = false;
        doc.descendants((node, pos) => {
          if (node.type.name === 'paperNode') {
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
        if ($head.parent.type.name === 'paperURLParagraph' && $head.pos === $head.end()) {
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