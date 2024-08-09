import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import { Avatar } from "@files-ui/react"
import { useUser } from '@/providers/UserProvider'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { client } from '@/honoClient';
export function Component() {
  const { user } = useUser();

  const [image, setImage] = useState<File | null>(() => {
    let userImg = user?.image;
    if (userImg) {
      return new File([new Blob()], userImg)
    }
    return null;
  });

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
    <div className='flex justify-between'>
      <div className='flex flex-col justify-between'>
        <h2 className="text-lg font-medium">
          Profile Avatar
        </h2>
        <Button size='sm'
          onClick={() => {
            if (!image) {
              return;
            }
            client.private.files.upload[':bucketName'].$post({
              param: {
                bucketName: "avatars"
              },
              form: {
                files: [
                  image
                ]
              }
            })
          }}

        >upoload</Button>
      </div>
      <Avatar
        src={image ? URL.createObjectURL(image) : undefined}
        accept='.png, .jpg'
        variant='circle'
        style={{
          width: "100px",
          height: "100px",
          fontSize: "10px",
          justifySelf: "end"
        }}
        onChange={(file) => {
          setImage(file);
        }}

      />
    </div>
  </div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/_layout-settings/settings/')({
  component: Component
})