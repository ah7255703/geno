import { RedisClientType } from 'redis';
import { z, ZodSchema } from 'zod';
import { publisher, subscriber } from '.';


function publishTypedMessage<T extends ZodSchema>(redisClient: RedisClientType, schema: T) {
    return {
        channel: (channel: string) => {
            return {
                publish: async (data: z.infer<T>) => {
                    const validated = schema.parse(data);
                    await redisClient.publish(channel, JSON.stringify(validated));
                },
            };
        },
    };
}

function subscribeToTypedMessage<T extends ZodSchema>(redisClient: RedisClientType, _schema: T) {
    return {
        channel: (channel: string) => {
            return {
                subscribe: async (callback: (data: z.infer<T>) => void) => {
                    await redisClient.subscribe(channel, (message) => {
                        const data = JSON.parse(message);
                        callback(data as z.infer<T>);
                    });
                    return async () => {
                        await redisClient.unsubscribe(channel);
                    }
                },
            };
        },
    };
}

interface PubSubEvent<C extends string, T extends ZodSchema> {
    channel: C;
    schema: T;
}

export function createPubSub<C extends string, T extends ZodSchema>(event: PubSubEvent<C, T>) {
    return {
        publish: publishTypedMessage(publisher, event.schema).channel(event.channel).publish,
        subscribe: subscribeToTypedMessage(subscriber, event.schema).channel(event.channel).subscribe,
    };
}
