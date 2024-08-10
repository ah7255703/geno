import type { Group } from './types'

export const GROUPS: Group[] = [
  {
    name: 'format',
    title: 'Format',
    commands: [
      {
        name: 'heading4',
        label: 'Heading 4',
        iconName: 'Heading4',
        description: 'High priority section title',
        aliases: ['h4'],
        action: editor => {
          editor.chain().focus().setHeading({ level: 4 }).run()
        },
      },
      {
        name: 'heading5',
        label: 'Heading 5',
        iconName: 'Heading5',
        description: 'Medium priority section title',
        aliases: ['h5'],
        action: editor => {
          editor.chain().focus().setHeading({ level: 5 }).run()
        },
      },
      {
        name: 'heading6',
        label: 'Heading 6',
        iconName: 'Heading6',
        description: 'Low priority section title',
        aliases: ['h6'],
        action: editor => {
          editor.chain().focus().setHeading({ level: 6 }).run()
        },
      },
      {
        name: 'bulletList',
        label: 'Bullet List',
        iconName: 'List',
        description: 'Unordered list of items',
        aliases: ['ul'],
        action: editor => {
          editor.chain().focus().toggleBulletList().run()
        },
      },
      {
        name: 'numberedList',
        label: 'Numbered List',
        iconName: 'ListOrdered',
        description: 'Ordered list of items',
        aliases: ['ol'],
        action: editor => {
          editor.chain().focus().toggleOrderedList().run()
        },
      },
      {
        name: 'taskList',
        label: 'Task List',
        iconName: 'ListTodo',
        description: 'Task list with todo items',
        aliases: ['todo'],
        action: editor => {
          editor.chain().focus().toggleTaskList().run()
        },
      },
      {
        name: 'blockquote',
        label: 'Blockquote',
        iconName: 'Quote',
        description: 'Element for quoting',
        action: editor => {
          editor.chain().focus().setBlockquote().run()
        },
      },
      {
        name: 'codeBlock',
        label: 'Code Block',
        iconName: 'SquareCode',
        description: 'Code block with syntax highlighting',
        shouldBeHidden: editor => editor.isActive('columns'),
        action: editor => {
          editor.chain().focus().setCodeBlock().run()
        },
      },
    ],
  },
  {
    name: 'insert',
    title: 'Insert',
    commands: [
      {
        name: 'table',
        label: 'Table',
        iconName: 'Table',
        description: 'Insert a table',
        shouldBeHidden: editor => editor.isActive('columns'),
        action: editor => {
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
        },
      },
      {
        name: 'image',
        label: 'Image',
        iconName: 'Image',
        description: 'Insert an image',
        aliases: ['img'],
        action: editor => {
          editor.chain().focus().setImageUpload().run()
        },
      },
      {
        name: 'columns',
        label: 'Columns',
        iconName: 'Columns2',
        description: 'Add two column content',
        aliases: ['cols'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: editor => {
          editor
            .chain()
            .focus()
            .setColumns()
            .focus(editor.state.selection.head - 1)
            .run()
        },
      },
      {
        name: 'horizontalRule',
        label: 'Horizontal Rule',
        iconName: 'Minus',
        description: 'Insert a horizontal divider',
        aliases: ['hr'],
        action: editor => {
          editor.chain().focus().setHorizontalRule().run()
        },
      },
      {
        name: 'toc',
        label: 'Table of Contents',
        iconName: 'Book',
        aliases: ['outline'],
        description: 'Insert a table of contents',
        shouldBeHidden: editor => editor.isActive('columns'),
        action: editor => {
          editor.chain().focus().insertTableOfContents().run()
        },
      },
    ],
  },
]

export default GROUPS
