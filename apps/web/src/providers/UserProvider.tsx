import { client } from "@/honoClient";
import { createSafeProvider } from "./create-safe-provider";
import type { InferResponseType } from 'hono/client';
import { useAuthContext } from "./AuthProvider";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useFileUrl } from "@/hooks/useFileUrl";

export type BackendUser = InferResponseType<typeof client.private.user.me.$get>;

type SharedData = {
    user: BackendUser | null;
    isLoading: boolean;
    authenticated: boolean;
    meta: {
        avatarUrl: string | null;
    }
}

const [SafeProvider, useUser] = createSafeProvider<SharedData>();

function UserProvider({ children }: { children: ((data: SharedData) => React.ReactNode) }) {
    const { tokens, logout } = useAuthContext();

    const { data, isLoading } = useSuspenseQuery({
        queryKey: [tokens],
        queryFn: async () => {
            const da = await client.private.user.me.$get();
            if (da.status === 401) {
                if (tokens) {
                    logout()
                }
                return null;
            }
            return da.json();
        },
        refetchInterval: 0,
        refetchOnWindowFocus: false,
    })

    const { url } = useFileUrl(data?.imageFileId, 'avatars');

    const user = data ?? null;

    const authenticated = !!user && !isLoading;

    const meta = {
        avatarUrl: url ?? null,
    }
    return (
        <SafeProvider value={{
            user, isLoading, authenticated, meta
        }}>
            {children({ user, isLoading, authenticated, meta })}
        </SafeProvider>
    );
}

export {
    useUser,
    UserProvider,
}