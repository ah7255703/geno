import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/_layout-settings/settings/social-accounts')({
  component: () => <div>Hello /(authenticated)/_layout/settings/social-accounts!</div>
})