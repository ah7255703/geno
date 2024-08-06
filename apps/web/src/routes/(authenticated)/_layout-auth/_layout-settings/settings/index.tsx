import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'

export function Component() {
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

  </div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/_layout-settings/settings/')({
  component: Component
})