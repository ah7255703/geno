import * as React from "react";
import InfiniteViewer from "react-infinite-viewer";
import Moveable from "react-moveable";
import { styled } from "react-css-styled";
import { StoreRoot, useStoreRoot } from "./store";

export function EditorManager() {
    const root = useStoreRoot();
    return null
}

export function Editor() {
    return <StoreRoot>
        <EditorManager />
    </StoreRoot>
}