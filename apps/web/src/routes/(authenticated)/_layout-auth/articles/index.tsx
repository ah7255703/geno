import { client } from '@/honoClient'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import noContentSvgDark from "../../../../../assets/snow-dark.svg?url"
import { Button } from '@/components/ui/button'
export function ArticlesSegmentComponent() {
  const articles = useQuery({
    queryKey: ['/private/articles'],
    queryFn: async () => {
      const res = await client.private.articles.$get()
      if (res.ok){
        return res.json()
      }
      return []
    }
  })

  return <div className='flex items-start lg:p-6 p-4 flex-col w-full'>
    <header className='flex items-center justify-between w-full'>
      <h2 className='text-xl font-bold tracking-tight'>Articles</h2>
      <Button size='sm' asChild>
        <Link to='/articles/create-article'>
          Create Article
        </Link>
      </Button>
    </header>
    <main className='w-full'>
      {
        articles.data?.map((article, index) => {
          return <article key={index}></article>
        })
      }
      {
        articles.data?.length === 0 && <div className='flex flex-col p-5 items-center justify-center size-full'>
          <img src={noContentSvgDark} alt="" className='h-56 aspect-square' />
          <h2 className='text-center text-xl font-bold tracking-tight'>
            No articles found
          </h2>
        </div>
      }
    </main>
  </div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/articles/')({
  component: ArticlesSegmentComponent
})