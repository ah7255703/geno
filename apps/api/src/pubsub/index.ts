import redis, { type RedisClientType } from 'redis';
import { env } from '../env';

export const publisher: RedisClientType = redis.createClient({
    url: env.REDIS_URL
})
export const subscriber: RedisClientType = redis.createClient({
    url: env.REDIS_URL
});

export async function onConnect() {
    publisher.connect();
    subscriber.connect();
}