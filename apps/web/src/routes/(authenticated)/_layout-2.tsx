import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/_layout-2')({
  component: () => <Outlet />
})