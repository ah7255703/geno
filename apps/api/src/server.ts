import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { socket } from './socket.js';
import { onConnect as RedisonStart } from './pubsub/index.js';

async function preStart() {
    RedisonStart()
}

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
console.log(`Server running at http://localhost:${port}`)
socket.listen(server)
export type BackendRoutes = typeof routes