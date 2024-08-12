import { TagInput } from '@/components/tag/tag-input';
import { Button } from '@/components/ui/button';
import { Field, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { BlockEditor } from '@/components/textEditor/components/BlockEditor';
import type { JSONContent } from '@tiptap/core';
import { DropZone } from '@/components/ui/dropzone';

const validation = z.object({
  title: z.string().min(1),
  content: z.custom<JSONContent>((f) => f),
  tags: z.array(z.object({
    id: z.string().min(1),
    text: z.string().min(1),
  })),
  images: z.array(z.object({
    id: z.string().min(1),
    file: z.custom<File>((f) => f),
  }))
})

export type CreateArticleType = z.infer<typeof validation>

export function ArticleAppComponent({
  defaultValues,
  onSubmit,
}: {
  defaultValues: CreateArticleType,
  onSubmit: (data: CreateArticleType) => void
}) {
  const form = useForm<CreateArticleType>({
    resolver: zodResolver(validation),
    defaultValues: defaultValues
  });

  const [tagActiveIndex, setTagActiveIndex] = useState<number | null>(null);


  function handleSubmit(_data: CreateArticleType) {
    onSubmit(_data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='contents'>
        <header className='flex items-center gap-5 py-2 justify-between w-full'>
          <h2 className='text-xl font-bold tracking-tight'>Create Article</h2>
          <Button size='sm' type='submit'>
            Save
          </Button>
        </header>

        <main className='w-full'>
          <div className='grid grid-cols-10 gap-4 p-3'>
            <div
              className='lg:col-span-6 col-span-full grid grid-cols-1 gap-2'
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
            </div>
            <Field
              control={form.control}
              name='images'
              render={(f) => {
                return <DropZone
                onChange={(files) => f.onChange(files)}
                defaultValue={f.value}
                />
              }}
              className='lg:col-span-4 col-span-full flex flex-col' />

          </div>
          <div className='flex flex-col gap-2 p-3 col-span-5'>
            <Field
              label='Content'
              control={form.control}
              name='content'
              render={(f) => <BlockEditor
                initialContent={f.value}
                onChange={(props) => f.onChange(props.editor.getJSON())}
              />}
            />
          </div>
        </main>
      </form>
    </Form>
  )
}
