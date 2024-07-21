import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod';
import { socket } from './socket.js';

async function preStart() { }




const app = new Hono({
    strict: true,
});

app.use(cors())

const routes = app.get("/", async (_ctx) => {
    return _ctx.json({ message: "Hello World" })
})
const port = 3001
const server = serve({
    fetch: app.fetch,
    port
}, (info) => {
    preStart()
})
socket.listen(server)
export type BackendRoutes = typeof routes