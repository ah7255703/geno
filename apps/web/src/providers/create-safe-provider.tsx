import React from "react";

export function createSafeProvider<T>(initalValue?: T) {
    const context = React.createContext<T>(initalValue ?? {} as T);
    const Provider = context.Provider;

    const useSafeContext = () => {
        const contextValue = React.useContext(context);
        if (contextValue === undefined) {
            throw new Error('useSafeContext must be used within a SafeProvider');
        }
        return contextValue
    }

    return [Provider, useSafeContext] as const;
}