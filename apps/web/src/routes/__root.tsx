import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/providers/AuthProvider'
import { UserProvider } from '@/providers/UserProvider'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ThemeProvider } from "next-themes"

export const Route = createRootRoute({
    component: () => (
        <ThemeProvider defaultTheme='dark' attribute='class'>
            <AuthProvider>
                <UserProvider>
                    <Outlet />
                    <TanStackRouterDevtools />
                    <Toaster />
                </UserProvider>
            </AuthProvider>
        </ThemeProvider>
    ),
})
