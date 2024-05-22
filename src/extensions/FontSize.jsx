import { Mark } from '@tiptap/core';

export const FontSize = Mark.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize.replace('px', ''),
        renderHTML: attributes => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}px`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style*=font-size]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setFontSize: (size) => ({ chain }) => {
        return chain().setMark(this.name, { fontSize: size }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().unsetMark(this.name).run();
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-f': () => this.editor.commands.unsetFontSize(),
    };
  },
});

export default FontSize;