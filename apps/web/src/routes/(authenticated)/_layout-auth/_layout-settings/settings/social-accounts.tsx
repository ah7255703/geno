import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'
import { client } from '@/honoClient'
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { SiLinkedin, SiGithub, SiX, SiFacebook, SiTelegraph } from '@icons-pack/react-simple-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon, PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { InferResponseType } from "hono/client"
import { toast } from 'sonner';
import { MultiStepComponent } from '@/components/MultiStepComponent';
import { useForm } from 'react-hook-form';
import { Field, Form } from '@/components/ui/form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/providers/UserProvider';


function geFullUrl() {
  return window.location.origin + window.location.pathname;
}

function ProviderIcon({ provider, className }: { provider: string; className?: string }) {
  switch (provider) {
    case 'linkedin':
      return <SiLinkedin className={className} />
    case 'github':
      return <SiGithub className={className} />
    case 'twitter':
      return <SiX />
    case 'facebook':
      return <SiFacebook className={className} />
    case 'telegraph':
      return <SiTelegraph className={className} />
    default:
      return null;
  }
}


const validationSchema = z.object({
  short_name: z.string(),
  author_name: z.string(),
  author_url: z.string().optional()
})

function AddTelegraphForm({
  defaultValues,
  footer,
  onSubmit
}: {
  defaultValues?: z.infer<typeof validationSchema>;
  footer?: React.ReactNode;
  onSubmit: (data: z.infer<typeof validationSchema>) => void;
}) {
  const form = useForm<z.infer<typeof validationSchema>>({
    defaultValues,
    resolver: zodResolver(validationSchema)
  });

  return <form className='space-y-3'
    onSubmit={form.handleSubmit(onSubmit)}
  >
    <Form {...form}>
      <Field
        control={form.control}
        name='author_name'
        label='Author Name'
        render={(f) => <Input {...f} />}
      />
      <Field
        control={form.control}
        name='short_name'
        label='Short Name'
        render={(f) => <Input {...f} />}
      />
      <Field
        control={form.control}
        name='author_url'
        label='Author URL'
        render={(f) => <Input {...f} />}
      />
      {footer}
    </Form>
  </form>
}

function LinkAccountComponent() {
  const { user } = useUser()
  const getGithubLink = useMutation({
    mutationFn: async () => {
      const redirectUrl = geFullUrl();
      const resp = await client.private.providers.link[':providerId'].$post({
        param: {
          providerId: "github",
        },
        json: {
          redirectUrl
        }
      });
      if (resp.ok) {
        const link = await resp.json();
        return link;
      }
      return null;
    }
  })

  const availableProviders = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const resp = await client.private.providers.available_to_add.$get();
      if (resp.ok) {
        const data = await resp.json();
        return data;
      }
    }
  });

  return <Dialog>
    <Button asChild variant='secondary' size="sm" className='text-xs'>
      <DialogTrigger>
        <PlusIcon className='size-5' />
        <span>Link Account</span>
      </DialogTrigger>
    </Button>
    <DialogContent>

      <MultiStepComponent
        steps={['telegraph', "home"] as const}
        initialStep='home'
        className='contents'
      >
        {({ currentStep, reset, setStep }) => {
          if (currentStep === "home") {
            return <>
              <DialogHeader>
                <DialogTitle>
                  Link Social Account
                </DialogTitle>
              </DialogHeader>
              <div className='grid gap-2 grid-cols-2'>
                {
                  availableProviders.data?.map((provider) => {
                    switch (provider.provider) {
                      case "github":
                        return <Button
                          key={provider.provider}
                          disabled={getGithubLink.isPending || !provider.available}
                          variant='outline' onClick={async () => {
                            const link = await getGithubLink.mutateAsync();
                            if (link) {
                              window.open(link.link, '_blank');
                            }
                          }
                          }>
                          <SiGithub className='mr-2 h-4 w-4' />
                          Link Github</Button>
                      case "telegraph":
                        return <Button
                          key={provider.provider}
                          onClick={() => setStep('telegraph')}
                          disabled={!provider.available}
                          variant='outline'>
                          <SiTelegraph className='mr-2 h-4 w-4' />
                          Link Telegraph
                        </Button>
                      default:
                        break;
                    }
                  })
                }
              </div>
            </>
          } if (currentStep === "telegraph") {
            return <>
              <DialogHeader>
                <DialogTitle>
                  Link Telegraph Account
                </DialogTitle>
              </DialogHeader>
              <AddTelegraphForm
                defaultValues={{
                  author_name: user?.name || '',
                  short_name: user?.name || '',
                }}
                onSubmit={async (data) => {
                  const resp = await client.private.providers.link.telegraph.$post({
                    json: {
                      author_name: data.author_name,
                      short_name: data.short_name,
                      author_url: data.author_url
                    }
                  })
                  if (resp.ok) {
                    toast.success('Account linked successfully')
                    // setStep('home')
                  }
                }}
                footer={<DialogFooter>
                  <Button variant='secondary' size='sm' onClick={() => setStep('home')}>
                    Back
                  </Button>
                  <Button type='submit' size='sm'>
                    Save
                  </Button>
                </DialogFooter>
                }
              />
            </>
          }
        }}
      </MultiStepComponent>
    </DialogContent>
  </Dialog>
}


type ProviderType = InferResponseType<typeof client.private.providers.$get>[number]

function ProviderAvatar({ provider }: { provider: ProviderType }) {
  if (provider.provider === 'github' && provider.accountData && "avatar_url" in provider?.accountData) {
    return <><Avatar>
      <AvatarImage
        src={provider.accountData?.avatar_url}
      />
      <AvatarFallback>
        <ProviderIcon provider={provider.provider} />
      </AvatarFallback>
    </Avatar>
      <div className='flex-1 flex flex-col justify-center'>
        <div className='flex items-center gap-1'>
          <h2 className='text-sm font-medium'>
            {provider.accountData?.name}
          </h2>
          <ProviderIcon
            provider={provider.provider}
            className='size-3'
          />
        </div>
        <p className='text-xs text-muted-foreground'>{provider.accountData?.email}</p>
      </div>
    </>
  }

  if (provider.provider === 'telegraph' && provider.accountData && "author_name" in provider?.accountData) {
    return <><Avatar>
      <AvatarFallback>
        <ProviderIcon provider={provider.provider} />
      </AvatarFallback>
    </Avatar>
      <div className='flex-1 flex flex-col justify-center'>
        <div className='flex items-center gap-1'>
          <h2 className='text-sm font-medium'>
            {provider.accountData?.author_name}
          </h2>
          <ProviderIcon
            provider={provider.provider}
            className='size-3'
          />
        </div>
        <p className='text-xs text-muted-foreground'>{provider.accountData?.short_name}</p>
      </div>
    </>
  }

  return null
}

function ProviderCard({ provider }: { provider: ProviderType }) {

  const deleteProvider = useMutation({
    mutationFn: async () => {
      const resp = await client.private.providers[':id'].$delete({
        param: {
          id: provider.id.toString()
        }
      });
      if (resp.ok) {
        return resp.json();
      }
    },
    onSuccess(data, variables, context) {
      toast.success('Provider disconnected successfully')
    },
    onError(error, variables, context) {
      toast.error('Failed to disconnect provider')
    },
  })

  return <Card className='flex gap-2 rounded-full items-center border p-2 justify-between'>
    <ProviderAvatar provider={provider} />
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon className='size-4' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='hover:bg-destructive'
          onSelect={(ev) => {
            confirm('Are you sure you want to disconnect this account?') && deleteProvider.mutateAsync()
          }}
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Card>
}

export function Component() {
  const loaderData = Route.useLoaderData();

  return <div className="space-y-6">
    <div className='flex flex-row items-center justify-between'>
      <div>
        <h3 className="text-lg font-medium">
          Social Accounts
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage, link social accounts
        </p>
      </div>
      <LinkAccountComponent />
    </div>
    <Separator />
    <div className='grid gap-2 grid-cols-2'>
      {
        loaderData.map((provider, idx) => <ProviderCard provider={provider} key={idx} />)
      }
    </div>
  </div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/_layout-settings/settings/social-accounts')({
  async loader(ctx) {
    const providers = await client.private.providers.$get();
    return providers.json()
  },
  component: Component
})