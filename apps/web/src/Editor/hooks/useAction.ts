import { useEffect, useState } from "react";
import { $actionManager } from "../stores/stores";
import { useStoreStateValue } from "../store";

export function useAction(actionName: string) {
    const [count, setCount] = useState(0);
    const [result, setResult] = useState<any>(null);
    const actionManager = useStoreStateValue($actionManager);

    useEffect(() => {
        const callback = (e: any) => {
            setCount(count + 1);
            setResult(e);
        };
        actionManager.on(actionName, callback);

        return () => {
            actionManager.off(actionName, callback);
        };
    }, [count]);

    return result;
}