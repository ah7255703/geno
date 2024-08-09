'use client'
import { EditorContent } from '@tiptap/react'
import { useRef } from 'react'
import ImageBlockMenu from '../../extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '../../extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '../../extensions/Table/menus'
import { TiptapProps } from './types'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { useBlockEditor } from '../../hooks/useBlockEditor'
import { LinkMenu } from '../menus'

export const BlockEditor = ({  }: TiptapProps) => {
  const menuContainerRef = useRef(null)
  const { editor } = useBlockEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  )
}

export default BlockEditor
