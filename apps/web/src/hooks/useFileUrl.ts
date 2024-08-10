import { client } from "@/honoClient";
import { useQuery } from "@tanstack/react-query";

export function useFileUrl(fileKey: string | null | undefined, bucketName: string, onSuccess?: (url: string) => void) {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['fileUrl', fileKey, bucketName],
        queryFn: async () => {
            if (!fileKey) {
                return null;
            }
            const resp = await client.private.files.url[":bucketName"][":key"].$get({
                param: {
                    bucketName,
                    key: fileKey
                }
            });
            const data = await resp.json()
            if (onSuccess) {
                onSuccess(data.url);
            }
            return data.url
        },
        enabled: !!fileKey,
    });
    return {
        url: data,
        isLoading,
        refetch: refetch
    };
}