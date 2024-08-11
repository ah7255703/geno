import { createFileRoute } from '@tanstack/react-router'
import { ArticleAppComponent } from './-components/ArticleAppComponent';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/honoClient';

function ManageArticleSegmentComponent() {
  const { articleId } = Route.useParams();
  const article = useQuery({
    queryKey: [
      'articles',
      articleId
    ],
    queryFn: async () => {
      const req = await client.private.articles[':articleId'].$get({
        param: {
          articleId: articleId
        }
      });
      if (req.status === 404) {
        return null
      }
      return req.json()
    }
  })

  return <div>
    {
      article.isLoading && !article.data ? 'Loading...' : article.data ? <ArticleAppComponent
        onSubmit={async (_data) => {
          const resp = await client.private.articles[':articleId'].$patch({
            param: {
              articleId: articleId
            },
            json: {
              title: _data.title,
              tags: _data.tags.map(t => t.text),
              content: _data.content
            }
          });
          if (resp.ok) {
            article.refetch()
          }
        }}
        defaultValues={{
          content: article.data.article.content,
          tags: article.data.article.tags.map(t => ({ id: t, text: t })),
          title: article.data.article.title,
        }}
      /> : "Article not found"
    }

  </div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/articles/$articleId')({
  component: ManageArticleSegmentComponent
})