import { z } from "zod";
import { createPubSub } from "./pubsub";

export const PingEvent = createPubSub({
    channel: "PING",
    schema: z.object({
        message: z.string(),
    }),
})