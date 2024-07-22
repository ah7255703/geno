import { BackendUser } from '@/providers/UserProvider'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export interface RouterContext {
    user: BackendUser | null
}

const RouteContext = createRootRouteWithContext<RouterContext>()

export const Route = RouteContext({
    component: () => {
        return <>
            <Outlet />
            <TanStackRouterDevtools />
        </>

    }
})
