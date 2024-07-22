import { MutableRefObject } from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";

import ClipboardManager from "../managers/clipboardManager";
import HistoryManager from "../managers/HistoryManager";
import LayerManager from "../managers/layerManager";
import KeyManager from "../managers/keyManager";
import MemoryManager from "../managers/memoryManager";
import ActionManager from "../managers/actionManager";

import { EditorManagerInstance } from "../EditorManager";
import { ScenaElementLayer, ScenaElementLayerGroup } from "../types";
import { Histories } from "../managers/histories/histories";
import { atom, compute } from "../store";


export const $showGuides = atom<boolean>(true);
export const $darkMode = atom<boolean>(true);


export const $layerManager = atom<LayerManager | null>(null);
export const $historyManager = atom<HistoryManager<Histories> | null>(null);
export const $clipboardManager = atom<ClipboardManager | null>(null);
export const $keyManager = atom<KeyManager | null>(null);
export const $memoryManager = atom<MemoryManager | null>(null);
export const $actionManager = atom<ActionManager | null>(null);

export const $horizontalGuidelines = atom<number[]>([]);
export const $verticalGuidelines = atom<number[]>([]);
export const $selectedLayers = atom<Array<ScenaElementLayer | ScenaElementLayerGroup>>([]);
export const $selectedFlattenLayers = compute(({ get }) => {
    const layerManager = get($layerManager)!;
    const selectedLayers = get($selectedLayers)!;

    return layerManager.toFlatten(selectedLayers);
});
export const $layers = atom<ScenaElementLayer[]>([]);
export const $scrollPos = atom<number[]>([0, 0]);
export const $zoom = atom<number>(1);
export const $groupOrigin = atom<string>("50% 50%");
export const $selectedTool = atom<string>("pointer");
export const $pointer = atom<string>("move");
export const $rect = atom<string>("rect");

export const $editor = atom<MutableRefObject<EditorManagerInstance | undefined> | null>(null);
export const $selecto = atom<MutableRefObject<Selecto | null> | null>(null);
export const $moveable = atom<MutableRefObject<Moveable | null> | null>(null);
export const $infiniteViewer = atom<MutableRefObject<InfiniteViewer | null> | null>(null);
export const $horizontalGuides = atom<MutableRefObject<Guides | null> | null>(null);
export const $verticalGuides = atom<MutableRefObject<Guides | null> | null>(null);
// export const $menu = atom<MutableRefObject<Menu | null> | null>(null);


