import { Content, Editor, EditorEvents, useEditor } from '@tiptap/react'
import { ExtensionKit } from '../extensions/extension-kit'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export type EditorProps = {
  initialContent?: Content;
  onChange?: (props: EditorEvents['update']) => void;
}

export const useBlockEditor = ({ initialContent, onChange }: EditorProps) => {
  const editor = useEditor(
    {
      immediatelyRender: false,
      autofocus: true,
      onCreate: ({ editor }) => {
        editor.commands.setContent(initialContent || '')
        editor.commands.focus('start', { scrollIntoView: true })
      },
      extensions: [
        ...ExtensionKit(),
      ].filter(e => !!e),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
      content: initialContent,
      onUpdate(props) {
        onChange?.(props)
      },
    },
    [],
  )
  const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 }

  window.editor = editor

  return { editor, characterCount }
}
