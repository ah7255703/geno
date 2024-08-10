import { typedStorage, useSyncedState } from "@/hooks/useSyncState";
import { createSafeProvider } from "./create-safe-provider";
import React, { useRef } from "react";
import { type TypedEventListener, TypedEventTarget } from 'typescript-event-target';

const [
    SafeProvider,
    useAuthContext,
] = createSafeProvider<{
    tokens: Tokens | null;
    events: TypedEventTarget<AuthEventMap>;
    login: (tokens: Tokens) => void;
    logout: () => void;
}>();

export const TOKENS_STORAGE_KEY = "tokens"

type Tokens = {
    accessToken: string;
    refreshToken: string;
}

interface AuthEventMap {
    login: CustomEvent<Tokens>;
    logout: CustomEvent<void>;
}

const tokenStorage = typedStorage<Tokens | null>("local")

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [
        tokens,
        setTokens,
    ] = useSyncedState(TOKENS_STORAGE_KEY, null, tokenStorage)
    const events = useRef(new TypedEventTarget<AuthEventMap>()).current;

    function login(tokens: Tokens) {
        setTokens(tokens)
        events.dispatchTypedEvent("login", new CustomEvent("login", { detail: tokens }))
    }

    function logout() {
        setTokens(null);
        events.dispatchTypedEvent("logout", new CustomEvent("logout"))
    }

    return (
        <SafeProvider value={{ tokens, events, logout, login }}>
            {children}
        </SafeProvider>
    )
}

function useOnAuthEvent<E extends keyof AuthEventMap>(event: E, callback: TypedEventListener<AuthEventMap, E>) {
    const { events } = useAuthContext();
    React.useEffect(() => {
        events.addEventListener(event, callback)
        return () => {
            events.removeEventListener(event, callback)
        }
    }, [events, callback])
}

export {
    AuthProvider,
    useAuthContext,
    useOnAuthEvent,
    tokenStorage
}