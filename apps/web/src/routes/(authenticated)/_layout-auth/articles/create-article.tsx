import { TagInput } from '@/components/tag/tag-input';
import { Button } from '@/components/ui/button';
import { Field, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone'
import { XIcon } from 'lucide-react';
import { BlockEditor } from '@/components/textEditor/components/BlockEditor';

const validation = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  images: z.array(
    z.instanceof(File)
  ),
  tags: z.array(z.object({
    id: z.string().min(1),
    text: z.string().min(1),
  })),
})

type CreateArticleType = z.infer<typeof validation>


export function CreateArticleSegmentComponent() {
  const form = useForm<CreateArticleType>({
    resolver: zodResolver(validation),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      images: []
    }
  });

  const [tagActiveIndex, setTagActiveIndex] = useState<number | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    noClick: true,
    onDropAccepted(files, event) {
      form.setValue("images", files)
    },
  })

  function handleSubmit(_data: CreateArticleType) { }

  return (<div className='flex items-start lg:p-6 p-4 flex-col w-full'>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='contents'>
        <input
          {...getInputProps()}
          className='hidden'
        />
        <header className='flex items-center gap-5 py-2 justify-between w-full'>
          <h2 className='text-xl font-bold tracking-tight'>Create Article</h2>
          <Button size='sm' type='submit'>
            Save
          </Button>
        </header>
        <main className='w-full'
          {...getRootProps()}
        >
          <div className='grid grid-cols-10 gap-4 p-3'>
            <div
              className='col-span-5 grid grid-cols-1 gap-2 grid-rows-5'
            >
              <Field
                control={form.control}
                label='Title'
                name='title'
                render={(f) => <Input {...f} />}
              />
              <Field
                control={form.control}
                label='Tags'
                name='tags'
                render={(f) => {
                  return <TagInput
                    autoComplete='off'
                    activeTagIndex={tagActiveIndex}
                    setActiveTagIndex={setTagActiveIndex}
                    tags={f.value}
                    setTags={f.onChange}
                  />
                }}
              />
              <Field
                control={form.control}
                name='images'
                className='row-span-3'
                render={(f) => {
                  return <Card className='size-full overflow-auto'>
                    <CardContent className='grid grid-cols-4 gap-2 overflow-auto p-4'>
                      {
                        f.value.map((_, index) => {
                          return <div key={index} className='aspect-square rounded-lg relative'>
                            <Button
                              onClick={() => {
                                f.onChange(f.value.filter((__, i) => i !== index))
                              }}
                              size='xicon' className='rounded-full absolute left-1 top-1' variant='secondary'>
                              <XIcon className='size-4' />
                            </Button>
                            <img
                              className='w-full size-full object-cover rounded-lg'
                              src={
                                typeof _ === 'string' ? _ : URL.createObjectURL(_)
                              } alt="" />
                          </div>
                        })
                      }
                    </CardContent>
                  </Card>
                }}
              />
            </div>
            <Field
              control={form.control}
              name='images'
              className='col-span-5'
              label='Images'
              render={(f) => {
                return <Carousel className='aspect-square border rounded-lg group overflow-hidden'>
                  <CarouselContent>
                    {f.value.map((_, index) => (
                      <CarouselItem key={index} className='aspect-square rounded-lg h-full'>
                        <img
                          className='object-cover w-full h-full rounded-lg'
                          src={
                            typeof _ === 'string' ? _ : URL.createObjectURL(_)
                          } alt="" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious
                    className='absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'
                  />
                  <CarouselNext
                    className='absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'
                  />
                </Carousel>
              }}
            />
          </div>
          <div>
            <BlockEditor
            />
          </div>
        </main>
      </form>
    </Form>
  </div>)
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/articles/create-article')({
  component: CreateArticleSegmentComponent
})