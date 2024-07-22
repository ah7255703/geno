import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/_layout-settings/settings/general')({
  component: () => <div>Hello /(authenticated)/_layout-settings/settings/general!</div>
})