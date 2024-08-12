import { createFileRoute } from '@tanstack/react-router'

export function OverviewComponent() {
  return <div>Overview</div>
}

export const Route = createFileRoute('/(authenticated)/_layout-auth/')({
  component: OverviewComponent
})