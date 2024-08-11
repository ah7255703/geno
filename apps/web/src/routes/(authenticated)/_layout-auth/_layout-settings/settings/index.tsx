import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '@/providers/UserProvider'
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { client } from '@/honoClient';
import { useFileUrl } from '@/hooks/useFileUrl';
import { AvatarImage, Avatar } from '@/components/ui/avatar';
import { PenIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Field, Form } from '@/components/ui/form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const userProfileSchema = z.object({
  name: z.string(),
})

type UserProfile = z.infer<typeof userProfileSchema>

export function Component() {
  const { user } = useUser();
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const imageUrl = useFileUrl(user?.imageFileId, 'avatars');
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<UserProfile>();
  function handleSubmit(_data: UserProfile) { }
  return <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">
        Profile Settings
      </h3>
      <p className="text-sm text-muted-foreground">
        Manage your account settings and set e-mail preferences.
      </p>
    </div>
    <Separator />
    <main className='grid grid-cols-6 gap-2'>
      <div className='flex justify-between col-span-full'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex flex-col justify-between h-full'>
            <h2 className="text-lg font-medium">
              Profile Avatar
            </h2>
            <Button size='sm'
              onClick={async () => {
                if (imageUrl.url && previewImage === new File([], imageUrl.url)) {
                  return;
                }
                if (previewImage) {
                  const resp = await client.private.user.settings.profile.avatar.$post({
                    form: {
                      avatarFile: [previewImage]
                    }
                  })
                  if (resp.ok) {
                    imageUrl.refetch();
                  }
                }
              }}
            >upoload</Button>
          </div>
          <div className='relative'>
            <Avatar className='size-28 relative'>
              <AvatarImage
                src={previewImage ? URL.createObjectURL(previewImage) : imageUrl.url || ""}
              />
            </Avatar>
            <input
              type="file"
              className='hidden'
              accept="image/*"
              ref={inputRef}
              onChange={(e) => {
                console.log(e.target.files?.[0]);
                setPreviewImage(e.target.files?.[0] ?? null);
              }}
            />
            <button
              type='button'
              onClick={() => {
                inputRef.current?.click();
              }}
              className='absolute bottom-0 right-0 text-secondary-foreground bg-background p-1 rounded-full'>
              <PenIcon className='size-4' />
            </button>
          </div>
        </div>
      </div>
      <Separator className='col-span-full my-4' />
      <Form {...form}>
        <form className='contents' onSubmit={form.handleSubmit(handleSubmit)}>
          <Field
            control={form.control}
            name="name"
            label='Name'
            className='col-span-3'
            render={(f) => <Input {...f} />}
          />

          <Card className='border-destructive col-span-full overflow-hidden'>
            <CardHeader className='p-3'>
              <CardTitle className='text-base font-medium'>
                Delete Account
              </CardTitle>
              <CardDescription>
                Once you delete your account, there is no going back. Please be certain.
              </CardDescription>
            </CardHeader>
            <CardFooter className='p-3 bg-muted/30 border-t flex justify-end items-center'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size='sm' variant='destructive'>Delete Account</Button>
                </DialogTrigger>
                <DialogContent className='p-0'>
                  <DialogHeader className='p-6'>
                    <DialogTitle>
                      Are you sure you want to delete your account?
                    </DialogTitle>
                    <DialogDescription>
                      Once you delete your account, there is no going back. Please be certain.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className='flex justify-end border-t px-6 py-2 bg-muted/30'>
                    <Button variant='destructive' size='sm'>Delete Account</Button>
                    <Button variant='secondary' size='sm'>Cancel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>


          <Card className='border-destructive col-span-full overflow-hidden'>
            <CardHeader className='p-3'>
              <CardTitle className='text-base font-medium'>
                Deactivate Account
              </CardTitle>
              <CardDescription>
                Deactivating your account will disable your account and remove your profile from the site.
              </CardDescription>
            </CardHeader>
            <CardFooter className='p-3 bg-muted/30 border-t flex justify-end items-center'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size='sm' variant='destructive'>
                    Deactivate Account
                  </Button>
                </DialogTrigger>
                <DialogContent className='p-0'>
                  <DialogHeader className='p-6'>
                    <DialogTitle>
                      Are you sure you want to delete your account?
                    </DialogTitle>
                    <DialogDescription>
                      Once you delete your account, there is no going back. Please be certain.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className='flex justify-end border-t px-6 py-2 bg-muted/30'>
                    <Button variant='destructive' size='sm'>Yup!</Button>
                    <Button variant='secondary' size='sm'>Nope!</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </main>

  </div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/_layout-settings/settings/')({
  component: Component
})