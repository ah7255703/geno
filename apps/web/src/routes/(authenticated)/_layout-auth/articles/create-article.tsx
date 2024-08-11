import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query';
import { client } from '@/honoClient';
import { ArticleAppComponent, type CreateArticleType } from './-components/ArticleAppComponent';

export function CreateArticleSegmentComponent() {
  const createPostMutation = useMutation({
    mutationFn: async (_data: CreateArticleType) => {
      const resp = await client.private.articles.$post({
        json: {
          title: _data.title,
          tags: _data.tags.map(t => t.text),
          content: _data.content
        }
      })
      return resp.json()
    }
  })
  return (
    <div className='flex items-start lg:p-6 p-4 flex-col w-full'>
      <ArticleAppComponent
        defaultValues={{
          title: '',
          content: {},
          tags: [],
        }}
        onSubmit={(data) => {
          createPostMutation.mutateAsync(data)
        }}
      />
    </div>
  )
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/articles/create-article')({
  component: CreateArticleSegmentComponent
})