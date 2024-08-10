import { type DefaultError, type QueryKey, useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { InferRequestType } from "hono"
import type { ClientResponse, InferResponseType } from "hono/client"

export const useEndpoint = <
    T extends (
        args: InferRequestType<T>,
        options?: Parameters<T>[1],
    ) => Promise<
        Awaited<ReturnType<T>> extends ClientResponse<
            infer T1,
            infer T2,
            infer T3
        >
        ? ClientResponse<T1, T2, T3>
        : never
    >,
    TQueryFnData = InferResponseType<T>,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    endpoint: T,
    params: InferRequestType<T>,
    baseQueryKey: string,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        // no need for queryKey and queryFn as they are derived from hono/client
        'queryKey' | 'queryFn'
    >,
) => {
    return useQuery<TQueryFnData, TError, TData, TQueryKey>({
        // TODO: cast to unknown cheats the typing system, should be properly inferred but not sure how atm
        queryKey: [baseQueryKey, params] as unknown as TQueryKey,
        queryFn: async () => {
            const res = await endpoint(params)
            return (await res.json()) as InferResponseType<T>
        },
        ...options,
    })
}