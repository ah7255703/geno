import _redis, { type RedisClientType } from 'redis';
import { env } from '../env';

export const redis: RedisClientType = _redis.createClient({
    url: env.REDIS_URL
})

export const publisher: typeof redis = redis.duplicate();

export const subscriber: typeof redis = redis.duplicate();

export async function onConnect() {
    redis.connect();
    publisher.connect();
    subscriber.connect();
}