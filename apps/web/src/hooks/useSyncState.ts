import { useCallback, useEffect, useRef, useState } from "react";

type StorageType = "memory" | "local" | "session";

function typedStorage<TData>(_storage: StorageType) {
    const storage = _storage === "local" ? localStorage : _storage === "session" ? sessionStorage : {
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
    };

    return {
        getItem(key: string): TData | null {
            const storageValue = storage.getItem(key);
            if (storageValue) {
                return JSON.parse(storageValue);
            }
            return null;
        },
        setItem(key: string, value: TData | null) {
            if (value === null) {
                storage.removeItem(key);
            } else {
                storage.setItem(key, JSON.stringify(value));
            }
        },
    };
}

function useSyncedState<TData = any>(key: string, defaultValue: TData | null = null, storage?: ReturnType<typeof typedStorage<TData>>) {
    const storageRef = useRef(storage ?? typedStorage<TData>("local"));

    const [state, setState] = useState<TData | null>(() => {
        const storageValue = storageRef.current.getItem(key);
        if (storageValue !== null) {
            return storageValue;
        }
        return defaultValue;
    });
    
    useEffect(() => {
        const storageValue = storageRef.current.getItem(key);
        if (storageValue !== null) {
            setState(storageValue);
        }
    }, [])
    const setSyncedState = useCallback((newState: TData | null) => {
        setState(newState);
        storageRef.current.setItem(key, newState);
    }, [key]);

    return [state, setSyncedState] as const;
}

export { typedStorage, useSyncedState };
