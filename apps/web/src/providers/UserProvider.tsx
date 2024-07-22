import { client } from "@/honoClient";
import { createSafeProvider } from "./create-safe-provider";
import { InferResponseType } from 'hono/client';
import { useAuthContext } from "./AuthProvider";
import { useSuspenseQuery } from "@tanstack/react-query";

export type BackendUser = InferResponseType<typeof client.private.user.me.$get>;

type SharedData = {
    user: BackendUser | null;
    isLoading: boolean;
    authenticated: boolean;
}

const [SafeProvider, useUser] = createSafeProvider<SharedData>();

function UserProvider({ children }: { children: ((data: SharedData) => React.ReactNode) }) {
    const { tokens } = useAuthContext();
    const { data, isLoading } = useSuspenseQuery({
        queryKey: [tokens],
        queryFn: async () => {
            let da = await client.private.user.me.$get();
            return da.json();
        },
    })

    let user = data ?? null;

    let authenticated = !!user && !isLoading;

    return (
        <SafeProvider value={{ user, isLoading, authenticated }}>
            {children({ user, isLoading, authenticated })}
        </SafeProvider>
    );
}

export {
    useUser,
    UserProvider,
}