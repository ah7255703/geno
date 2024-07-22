import { useUser } from '@/providers/UserProvider'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/_layout')({
  component: () => {
    const { authenticated } = useUser();
    if (!authenticated) {
      return <div>Protected!</div>
    }
    return <div>
      <Outlet />
    </div>
  }
})