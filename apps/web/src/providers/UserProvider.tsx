import { client } from "@/honoClient";
import { createSafeProvider } from "./create-safe-provider";
import { InferResponseType } from 'hono/client';
import { useAuthContext } from "./AuthProvider";
import { useQuery } from "@tanstack/react-query";

type User = InferResponseType<typeof client.private.user.me.$get>;

const [SafeProvider, useUser] = createSafeProvider<{
    user: User | null;
    isLoading: boolean;
    authenticated: boolean;
}>();

function UserProvider({ children }: { children: React.ReactNode }) {
    const { tokens } = useAuthContext();
    const { data, isLoading } = useQuery({
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
            {children}
        </SafeProvider>
    );
}

export {
    useUser,
    UserProvider,
}