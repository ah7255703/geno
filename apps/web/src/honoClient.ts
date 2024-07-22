import { hc } from 'hono/client';
import { BackendRoutes } from "../../api/src/server";
import { TOKENS_STORAGE_KEY, tokenStorage } from './providers/AuthProvider';

export const client = hc<BackendRoutes>("http://localhost:3001", {
    async headers() {
        let tokens = tokenStorage.getItem(TOKENS_STORAGE_KEY);
        if (tokens) {
            return {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        }
        return {
            Authorization: ""
        }
    },
}).api;