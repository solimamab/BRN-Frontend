import { Node, mergeAttributes } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';

// Helper function to create custom paragraph nodes for each experiment field
const createExperimentParagraphNode = (name, dataType) => {
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

// Custom nodes for each experiment field
const ExperimentNameParagraph = createExperimentParagraphNode('experimentNameParagraph', 'experimentName');
const TaskContextParagraph = createExperimentParagraphNode('taskContextParagraph', 'taskContext');
const TaskParagraph = createExperimentParagraphNode('taskParagraph', 'task');
const TaskExplainedParagraph = createExperimentParagraphNode('taskExplainedParagraph', 'taskExplained');
const DiscussionParagraph = createExperimentParagraphNode('discussionParagraph', 'discussion');
const ExperimentURLParagraph = createExperimentParagraphNode('experimentURLParagraph', 'experimentURL');

// Main ExperimentNode definition
export const ExperimentNode = Node.create({
  name: 'experimentNode',
  group: 'block',
  content: 'experimentNameParagraph taskContextParagraph taskParagraph taskExplainedParagraph discussionParagraph experimentURLParagraph',
  
  addAttributes() {
    return {
      uuid: {
        default: null // UUID will be null for new nodes initially
      }
    };
  },

  parseHTML() {
    return [{ tag: 'experiment-node' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {'class': 'experiment-node'}), 0];
  },

  addCommands() {
    return {
      addExperimentNode: attributes => ({ commands }) => {
        return commands.insertContent({
          type: 'experimentNode',
          attrs: attributes,
          content: [
            { type: 'experimentNameParagraph', content: [{ type: 'text', text: ' ' || "Experiment Name" }] },
            { type: 'taskContextParagraph', content: [{ type: 'text', text: ' ' || "Task Context" }] },
            { type: 'taskParagraph', content: [{ type: 'text', text: ' ' || "Task" }] },
            { type: 'taskExplainedParagraph', content: [{ type: 'text', text: ' ' || "Task Explained" }] },
            { type: 'discussionParagraph', content: [{ type: 'text', text: ' ' || "Discussion" }] },
            { type: 'experimentURLParagraph', content: [{ type: 'text', text: ' ' || "http://example.com" }] },
          ],
        });
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      ArrowDown: () => {
        const { state, view } = this.editor;
        const { $head } = state.selection;
  
        // Check if the selection is at the end of the paperURLParagraph
        if ($head.parent.type.name === 'experimentURLParagraph' && $head.pos === $head.end()) {
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

