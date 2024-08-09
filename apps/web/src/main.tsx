import '@fontsource-variable/noto-sans';
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import "./globals.css"
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import NProgress from 'nprogress'
import { routeTree } from './routeTree.gen'
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './providers/AuthProvider';
import { UserProvider } from './providers/UserProvider';
import { Suspense, useEffect } from 'react';
import { setAppSession } from './hooks/appSession';

let np = NProgress.configure({ showSpinner: false, parent: "body", easing: 'ease' });

const router = createRouter({
    routeTree,
    context: {
        user: null
    },
})

router.__store.subscribe(() => {
    let state = router.__store.state;
    if (state.status === 'idle') {
        np.done();
    }
    if (state.status === 'pending') {
        np.start();
    }
})
// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
const queryClient = new QueryClient();

export function App() {
    useEffect(() => {
        setAppSession()
    }, [])
    return <ThemeProvider defaultTheme='light' attribute='class'>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Suspense fallback={"loading user data"}>
                    <UserProvider>
                        {({ user }) => {
                            return <RouterProvider
                                context={{ user }}
                                router={router} />
                        }}
                    </UserProvider>
                </Suspense>
            </AuthProvider>
        </QueryClientProvider>
        <Toaster />
    </ThemeProvider>
}


// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
