import Editor from '@/Editor/Editor'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/_layout-2/')({
  component: () => <div className='h-screen w-full'>
    <Editor />
  </div>
})