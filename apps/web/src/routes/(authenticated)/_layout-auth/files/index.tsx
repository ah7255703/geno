import { client } from '@/honoClient'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, } from '@tanstack/react-router'
import noContentSvgDark from "../../../../../assets/snow-dark.svg?url"
import { useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card'


export function FilesViewComponent() {
  const files = useQuery({
    queryKey: ['/private/files'],
    queryFn: async () => {
      const res = await client.private.files.userFiles.$get()
      return res.json()
    }
  })
  const [
    fileUpload,
    setFileUpload
  ] = useState<{
    id: string;
    file: File;
    progress: number;
    status: 'uploading' | 'done' | 'error' | "idle" | "canceled";
  }>()

  const { getInputProps, getRootProps } = useDropzone({
    onDropAccepted(files) {
      setFileUpload({
        id: Math.random().toString(),
        file: files[0],
        progress: 0,
        status: 'uploading'
      })
    },
  })


  return <div className='flex items-start lg:p-6 p-4 flex-col w-full'>
    <header className='flex items-center justify-between w-full'>
      <h2 className='text-xl font-bold tracking-tight'>Files</h2>
    </header>
    <main className='w-full' {...getRootProps()}>
      <input {...getInputProps()} />
      {
        files.data?.map((file, index) => {
          return <Card>
            <CardContent>

            </CardContent>
          </Card>
        })
      }
      {
        files.data?.length === 0 && <div className='flex flex-col p-5 items-center justify-center size-full'>
          <img src={noContentSvgDark} alt="" className='h-56 aspect-square' />
          <h2 className='text-center text-xl font-bold tracking-tight'>
            No files found
          </h2>
        </div>
      }
    </main>
  </div>
}
export const Route = createFileRoute('/(authenticated)/_layout-auth/files/')({
  component: FilesViewComponent
})