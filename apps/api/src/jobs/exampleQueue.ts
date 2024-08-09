import { Queue, Worker } from 'bullmq';
import { env, redis } from 'src/env';

const exampleQueue = new Queue('exampleQueue', {
    connection: {
        host: redis.host,
        port: redis.port,
    }
});

const exampleWorker = new Worker('exampleQueue', async (job) => { }, {
    connection: {
        host: redis.host,
        port: redis.port,
    }
});