import { client } from '@/honoClient'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import noContentSvgDark from "../../../../../assets/snow-dark.svg?url"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { InferResponseType } from 'hono/client';
import { genHtml } from '@/components/textEditor/extensions/extension-kit';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type ComponentProps, type ElementType, forwardRef, ReactNode, useMemo, useState } from 'react';
import { useMeasure } from '@uidotdev/usehooks';

type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T> | null;

export function mergeRefs<T>(...refs: ReactRef<T>[]): React.RefCallback<T> {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}


type ArticleType = InferResponseType<typeof client.private.articles.$get>["articles"][number]

function Article({ article }: { article: ArticleType }) {
  return <Card key={article.id} className='col-span-2 p-0 relative'>
    <DropdownMenu>
      <DropdownMenuTrigger className='absolute right-2 top-2'>
        <MoreVertical className='h-5 w-5' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Manage
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div className='w-full aspect-square border rounded-xl'>
    </div>
    <CardHeader className='p-3 flex'>
      <Link to={`/articles/${article.id}`}>
        <CardTitle className='text-base font-medium'>
          {article.title}
        </CardTitle>
      </Link>
    </CardHeader>
  </Card>
}

export function ArticlesSegmentComponent() {
  const articles = useQuery({
    queryKey: ['/private/articles'],
    queryFn: async () => {
      const res = await client.private.articles.$get({})
      return (await res.json()) ?? []
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
      <div className='grid grid-cols-6 gap-4 py-3 px-2'>
        {
          articles.data?.articles?.map((article) => <Article article={article} key={article.id} />)
        }
      </div>
      {
        articles.data?.articles?.length === 0 && <div className='flex flex-col p-5 items-center justify-center size-full'>
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