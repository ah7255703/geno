import { hc } from 'hono/client';
import { BackendRoutes } from "../../api/src/server";
import { TOKENS_STORAGE_KEY, tokenStorage } from './providers/AuthProvider';
import { jwtDecode } from "jwt-decode";
import { isBefore } from "date-fns";
import { appSessionStorage } from './hooks/appSession';

export const publicClient = hc<BackendRoutes>("http://localhost:3001", {}).api;


async function getTokens() {
    let tokens = tokenStorage.getItem(TOKENS_STORAGE_KEY);
    if (!tokens) {
        return null
    }
    let decoded = jwtDecode(tokens.accessToken);

    if (decoded.exp && isBefore(new Date(decoded.exp * 1000), new Date())) {
        let refreshToken = tokens.refreshToken;
        let res = await publicClient.auth.jwt.refresh.$post({
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
        let _headers: Record<string, string> = {};
        let tokens = await getTokens();
        let session = appSessionStorage.getItem();

        if (tokens) {
            _headers["Authorization"] = `Bearer ${tokens.accessToken}`
        }

        if (session) {
            _headers["X-Session-Id"] = session.sessionValue;
        }
        
        return _headers
    },
}).api;