import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/_layout-auth/')({
  component: () => <div>Overview</div>
})