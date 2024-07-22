import { Editor } from '@/Editor'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/_layout-2/')({
  component: () => <Editor />
})