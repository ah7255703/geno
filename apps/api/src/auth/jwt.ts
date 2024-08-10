import jwt from "jsonwebtoken";
import z from "zod";


const jwtStrategy = <S extends z.ZodSchema>(
    schema: S
) => {
    return {
        sign: (data: z.infer<S>, secret: string, options: jwt.SignOptions) => {
            return jwt.sign(schema.parse(data), secret, options)
        },
        verify: (token: string, secret: string): z.infer<S> => {
            const payload = jwt.verify(token, secret) as unknown;
            return schema.parse(payload)
        },
        schema,
        authorization: "Bearer"
    }
}

export const jwtAuth = jwtStrategy(z.object({
    userId: z.string(),
}))
