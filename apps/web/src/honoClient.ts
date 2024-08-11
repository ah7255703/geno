import { hc } from 'hono/client';
import type { BackendRoutes } from "../../api/src/server.ts";
import { TOKENS_STORAGE_KEY, tokenStorage } from './providers/AuthProvider';
import { jwtDecode } from "jwt-decode";
import { isBefore } from "date-fns";
import { appSessionStorage } from './hooks/appSession';

export const publicClient = hc<BackendRoutes>("http://localhost:3001", {}).api;


async function getTokens() {
    const tokens = tokenStorage.getItem(TOKENS_STORAGE_KEY);
    if (!tokens) {
        return null
    }
    const decoded = jwtDecode(tokens.accessToken);

    if (decoded.exp && isBefore(new Date(decoded.exp * 1000), new Date())) {
        const refreshToken = tokens.refreshToken;
        const res = await publicClient.auth.jwt.refresh.$post({
            json: {
                refreshToken
            }
        })
        if (res.ok) {
            const newTokens = await res.json();
            tokenStorage.setItem(TOKENS_STORAGE_KEY, newTokens);
            return newTokens;
        }
    }
    return tokens;
}

export const client = hc<BackendRoutes>("http://localhost:3001", {
    async headers() {
        const _headers: Record<string, string> = {};
        const tokens = await getTokens();
        const session = appSessionStorage.getItem();

        if (tokens) {
            _headers.Authorization = `Bearer ${tokens.accessToken}`
        }

        if (session) {
            _headers["X-Session-Id"] = session.sessionValue;
        }

        return _headers
    },
}).api;
