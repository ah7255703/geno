import { hc } from 'hono/client';
import { BackendRoutes } from "../../api/src/server";

export const client = hc<BackendRoutes>("http://localhost:3001",);