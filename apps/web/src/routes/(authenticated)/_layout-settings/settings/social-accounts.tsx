import { Separator } from '@/components/ui/separator'
import { client } from '@/honoClient'
import { createFileRoute } from '@tanstack/react-router'
import { Linkedin } from 'lucide-react';

export const Route = createFileRoute('/(authenticated)/_layout-settings/settings/social-accounts')({
  async loader(ctx) {
    let providers = await client.private.providers.$get();
    return providers.json()
  },
  component: () => {
    const loaderData = Route.useLoaderData()
    return <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          Social Accounts
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage, link social accounts
        </p>
      </div>
      <Separator />
      <div>
        {
          loaderData.map((provider, idx) => {
            return <div key={idx} className='rounded-xl p-5'>
              {
                provider.provider === 'linkedin' && <Linkedin />
              }
              <h2>
                {provider.provider}
              </h2>
            </div>
          })
        }
      </div>
    </div>
  }
})