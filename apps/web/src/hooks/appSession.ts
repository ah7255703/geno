import { typedStorageWithKey } from "./useSyncState";
import { v4 } from "uuid";

export const appSessionStorage = typedStorageWithKey<{
    sessionValue: string;
    createdAt: number;
}>("local", "app:session");

export function setAppSession() {
    if (appSessionStorage.getItem()) {
        return;
    }
    appSessionStorage.setItem({
        createdAt: Date.now(),
        sessionValue: v4(),
    })
}
