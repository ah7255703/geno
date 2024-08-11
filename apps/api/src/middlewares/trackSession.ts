import { createMiddleware } from 'hono/factory';
import { redis } from 'src/pubsub';

const MAX_LAST_REQUESTS = 10; // max per second

type Session = {
    id: string;
    lastRequestAt: number;
    requests: number;
    meta: Record<string, any>;
}

export const trackSession = createMiddleware(async (_ctx, next) => {
    const sessionId = _ctx.get("sessionId");
    
    if (sessionId) {
        const session = await redis.get(`session:${sessionId}`)
        if (session) {
            const parsedSession: Session = JSON.parse(session);
            const now = Date.now();
            if (now - parsedSession.lastRequestAt < 1000) {
                if (parsedSession.requests >= MAX_LAST_REQUESTS) {
                    return _ctx.json({ error: "Rate limit exceeded" }, 429)
                }
                parsedSession.requests += 1;
            } else {
                parsedSession.requests = 1;
            }
            parsedSession.lastRequestAt = now;
            await redis.set(`session:${sessionId}`, JSON.stringify(parsedSession));
            _ctx.header("X-Session-Requests", parsedSession.requests.toString());
            _ctx.header("X-Session-Last-Request-At", parsedSession.lastRequestAt.toString()); 
        } else {
            redis.set(`session:${sessionId}`, JSON.stringify({
                id: sessionId,
                lastRequestAt: Date.now(),
                requests: 1,
                meta: {},
            }));
        }
    }
    await next()
});