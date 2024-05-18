import { Node, mergeAttributes } from '@tiptap/core';

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

  parseHTML() {
    return [{ tag: 'paper-node' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {'class': 'paper-node'}), 0];
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
    };
  }
});