import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '@/providers/UserProvider'
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { client } from '@/honoClient';
import { useFileUrl } from '@/hooks/useFileUrl';
import { AvatarImage, Avatar } from '@/components/ui/avatar';
import { PenIcon } from 'lucide-react';

export function Component() {
  const { user } = useUser();
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const imageUrl = useFileUrl(user?.imageFileId, 'avatars');
  const inputRef = useRef<HTMLInputElement>(null);

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
          onClick={async () => {
            if (imageUrl.url && previewImage === new File([], imageUrl.url)) {
              return;
            }
            if (previewImage) {
              let resp = await client.private.user.settings.profile.avatar.$post({
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
        <Avatar className='size-24 relative'>
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
          onClick={() => {
            inputRef.current?.click();
          }}
          className='absolute bottom-0 right-0 text-secondary-foreground bg-background p-1 rounded-full'>
          <PenIcon className='size-7' />
        </button>
      </div>
    </div>
  </div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/_layout-settings/settings/')({
  component: Component
})