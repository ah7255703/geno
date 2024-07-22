import * as React from "react";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";
import Selecto from "react-selecto";
import { styled } from "react-css-styled";
import Moveable from "react-moveable";

// import ToolBar from "./ToolBar/ToolBar";
import Viewport, { ViewportInstnace } from "./components/viewPort";
import { prefix, checkInput, getParnetScenaElement, keyChecker, isArrayEquals } from "./utils/utils";

import LayerManager, { createGroup, createLayer } from "./managers/layerManager";
import KeyManager from "./managers/keyManager";
import HistoryManager from "./managers/historyManager";
import ActionManager from "./managers/actionManager";
import MemoryManager from "./managers/memoryManager";

import { EDITOR_CSS } from "./css";

import { useStoreRoot, useStoreStateSetPromise, useStoreStateValue, useStoreValue } from "@scena/react-store";
import {
    $actionManager, $layerManager, $editor,
    $historyManager, $horizontalGuides, $infiniteViewer,
    $keyManager, $layers, $memoryManager, $moveable,
    $selectedLayers, $selecto, $verticalGuides, $zoom, $showGuides, $darkMode,
} from "./stores/stores";
import { $alt, $meta, $shift, $space } from "./stores/keys";


import { GuidesManager } from "./components/guidesManager";
import { InfiniteViewerManager } from "./components/infiniteViewerManager";
import { SelectoManager } from "./components/selectoManager";
import { MoveableManager } from "./components/movableManager";
import { ScenaElementLayer, ScenaElementLayerGroup } from "./types";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";



const EditorElement = styled("div", EDITOR_CSS);



export interface EditorManagerInstance {
    editorElementRef: React.MutableRefObject<HTMLDivElement | null>;
    historyManager: HistoryManager;
    actionManager: ActionManager;
    memoryManager: MemoryManager;
    layerManager: LayerManager;
    keyManager: KeyManager;

    // menuRef: React.MutableRefObject<ToolBar | null>;
    moveableRef: React.MutableRefObject<Moveable | null>;
    selectoRef: React.MutableRefObject<Selecto | null>;
    viewportRef: React.MutableRefObject<ViewportInstnace | null>;

    changeLayers(layers: ScenaElementLayer[], groups?: ScenaElementLayerGroup): Promise<boolean>;
    setLayers(layers: ScenaElementLayer[], groups?: ScenaElementLayerGroup): Promise<boolean>;
    setSelectedLayers(
        layerGroups: Array<ScenaElementLayer | ScenaElementLayerGroup>,
        isRestore?: boolean,
    ): Promise<boolean>;
}

export default function EditorManager2() {
    const root = useStoreRoot();
    const editorRef = React.useRef<EditorManagerInstance>();

    const historyManager = React.useMemo(() => new HistoryManager<Histories>(editorRef), []);
    const actionManager = React.useMemo(() => new ActionManager(), []);
    const memoryManager = React.useMemo(() => new MemoryManager(), []);
    const layerManager = React.useMemo(() => new LayerManager(), []);
    const keyManager = React.useMemo(() => new KeyManager(root, actionManager), []);


    const horizontalGuidesRef = React.useRef<Guides>(null);
    const verticalGuidesRef = React.useRef<Guides>(null);
    const infiniteViewerRef = React.useRef<InfiniteViewer>(null);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);
    // const menuRef = React.useRef<ToolBar>(null);
    const viewportRef = React.useRef<ViewportInstnace>(null);
    // const tabsRef = React.useRef<Tabs>(null);
    const editorElementRef = React.useRef<HTMLDivElement>(null);


    // declare global store
    useStoreValue($historyManager, historyManager);
    useStoreValue($actionManager, actionManager);
    useStoreValue($memoryManager, memoryManager);
    useStoreValue($layerManager, layerManager);
    useStoreValue($keyManager, keyManager);

    // declare global ui component
    useStoreValue($moveable, moveableRef);
    useStoreValue($selecto, selectoRef);
    useStoreValue($infiniteViewer, infiniteViewerRef);
    useStoreValue($horizontalGuides, horizontalGuidesRef);
    useStoreValue($verticalGuides, verticalGuidesRef);
    useStoreValue($editor, editorRef);

    const showGuidesStore = useStoreValue($showGuides);
    const zoomStore = useStoreValue($zoom);
    const layerStore = useStoreValue($layers);

    React.useMemo(() => {
        const layers: ScenaElementLayer[] = [
            createLayer({
                style: {
                    position: "absolute",
                    border: "1px solid #333",
                    width: "100px",
                    height: "100px",
                },
                jsx: <div></div>,
            }),
            createLayer({
                scope: ["g"],
                style: {
                    position: "absolute",
                    border: "1px solid #f55",
                    top: "100px",
                    left: "100px",
                    width: "100px",
                    height: "100px",
                },
                jsx: <div></div>,
            }),
            createLayer({
                scope: ["g"],
                style: {
                    position: "absolute",
                    border: "1px solid #f55",
                    top: "150px",
                    left: "150px",
                    width: "100px",
                    height: "100px",
                },
                jsx: <div></div>,
            }),
            createLayer({
                scope: ["b"],
                style: {
                    "border-radius": "10px",
                    position: "absolute",
                    border: "1px solid #f55",
                    top: "150px",
                    left: "300px",
                    width: "200px",
                    height: "200px",
                },
                jsx: <div></div>,
            }),
            createLayer({
                title: "Scena Icon",
                jsx: <ScenaIcon stroke="#333" style={{
                    width: "300px",
                    height: "300px",
                }}/>,
            }),
            createLayer({
                title: "Main Title",
                style: {
                    border: "2px dashed #4af",
                    padding: "20px",
                    display: "inline-block",
                    fontSize: "30px",
                    fontWeight: "bold",
                },
                jsx: <div>
                    Everything in the editor,<br />
                    Tools, Animations, and Viewers,<br />
                    All with Open Source.<br />
                </div>,
            }),
        ];
        const groups: ScenaElementLayerGroup[] = [
            createGroup({
                id: "g",
            }),
            createGroup({
                id: "b",
            }),
        ];
        layerManager.setLayers(layers, groups);


        layerStore.value = layers;
        return layers;
    }, []);

    React.useEffect(() => {
        layerManager.calculateLayers();
    }, []);

    const setLayersPromise = useStoreStateSetPromise($layers);
    const selectedLayersStore = useStoreValue($selectedLayers);
    const setSelectedLayersPromise = useStoreStateSetPromise($selectedLayers);
    const onBlur = React.useCallback((e: any) => {
        const target = e.target as HTMLElement | SVGElement;

        if (!checkInput(target)) {
            return;
        }
        const parentTarget = getParnetScenaElement(target);

        if (!parentTarget) {
            return;
        }
        // const info = viewportRef.current!.getInfoByElement(parentTarget)!;


        // if (!info.attrs!.contenteditable) {
        //     return
        // }
        // const nextText = (parentTarget as HTMLElement).innerText;

        // if (info.innerText === nextText) {
        //     return;
        // }
        // historyManager.addHistory("changeText", {
        //     id: info.id,
        //     prev: info.innerText,
        //     next: nextText,
        // });
        // info.innerText = nextText;
    }, []);
    const changeLayers = React.useCallback((layers: ScenaElementLayer[], groups = layerManager.groups) => {
        layerManager.setLayers(layers, groups);
        layerManager.calculateLayers();
        return setLayersPromise(layers);
    }, []);

    const setLayers = React.useCallback((layers: ScenaElementLayer[], groups = layerManager.groups) => {
        layerManager.setLayers(layers, groups);
        return setLayersPromise(layers).then(complete => {
            layerManager.calculateLayers();
            return complete;
        });
    }, []);
    const setSelectedLayers = React.useCallback((
        nextLayers: Array<ScenaElementLayer | ScenaElementLayerGroup>,
        isRestore?: boolean,
    ) => {
        const prevLayers = selectedLayersStore.value;

        if (isArrayEquals(prevLayers, nextLayers)) {
            return Promise.resolve(false);
        }
        return setSelectedLayersPromise(nextLayers).then(complete => {
            if (!complete) {
                return false;
            }
            layerManager.calculateLayers();

            if (!isRestore) {
                const prevs = prevLayers;
                const nexts = nextLayers;

                historyManager.addHistory("selectTargets", { prevs, nexts });
            }

            selectoRef.current!.setSelectedTargets(layerManager.toTargetList(nextLayers).flatten());
            actionManager.act("set.selected.layers");
            return true;
        });
    }, []);

    editorRef.current = React.useMemo<EditorManagerInstance>(() => {
        return {
            editorElementRef,

            historyManager,
            actionManager,
            memoryManager,
            layerManager,
            keyManager,
            moveableRef,
            selectoRef,
            viewportRef,
            // menuRef,
            changeLayers,
            setLayers,
            setSelectedLayers,
        };
    }, []);


    React.useEffect(() => {
        const onUpdate = () => {
            requestAnimationFrame(() => {
                actionManager.act("get.rect", {
                    rect: moveableRef.current!.getRect(),
                });
            });
        };
        actionManager.on("render.end", onUpdate);
        actionManager.on("changed.targets", onUpdate);
        actionManager.on("update.rect", onUpdate);


        actionManager.on("select.all", e => {
            e.inputEvent?.preventDefault();
            const layers = root.get($layers);

            const childs = layerManager.selectSameDepthChilds(
                [],
                layers.map(layer => layer.ref.current!),
                [],
            );

            setSelectedLayers(layerManager.toLayerGroups(childs));
        });
        actionManager.on("request.history.undo", e => {
            e.inputEvent?.preventDefault();
            historyManager.undo();
        });
        actionManager.on("request.history.redo", e => {
            e.inputEvent?.preventDefault();
            historyManager.redo();
        });

        // register key
        keyManager.toggleState(["shift"], $shift, keyChecker);
        keyManager.toggleState(["space"], $space, keyChecker);
        keyManager.toggleState(["meta"], $meta, keyChecker);
        keyManager.toggleState(["alt"], $alt, keyChecker);

        // action down
        keyManager.keydown(["shift", "r"], () => {
            showGuidesStore.update(!showGuidesStore.value);
        });
        keyManager.actionDown(["left"], "move.left");
        keyManager.actionDown(["right"], "move.right");
        keyManager.actionDown(["up"], "move.up");
        keyManager.actionDown(["down"], "move.down");
        // TODO: window key
        keyManager.actionDown(["meta", "a"], "select.all");

        // action up
        keyManager.actionUp(["delete"], "remove.targets");
        keyManager.actionUp(["backspace"], "remove.targets");


        keyManager.actionDown(["meta", "z"], "request.history.undo");
        keyManager.actionDown(["meta", "shift", "z"], "request.history.redo");

        // register default events
        // const onResize = () => {
        //     horizontalGuidesRef.current!.resize();
        //     verticalGuidesRef.current!.resize();
        // };
        const startId = requestAnimationFrame(() => {
            // onResize();
            infiniteViewerRef.current!.scrollCenter();
        });
        registerHistoryTypes(historyManager);
        // window.addEventListener("resize", onResize);

        return () => {
            layerManager.set([], []);
            historyManager.clear();
            actionManager.off();
            keyManager.destroy();
            cancelAnimationFrame(startId);
            // window.removeEventListener("resize", onResize);
        };
    }, []);


    const showGuides = useStoreStateValue($showGuides);
    const darkMode = useStoreStateValue($darkMode);
    const leftTabs = React.useMemo(() => [
        "layers",
    ], []);
    const rightTabs = React.useMemo(() => [
        "align",
        "transform",
        "fill",
        "stroke",
        "frame",
        "history",
    ], []);
    return React.useMemo(() => <EditorElement
        ref={editorElementRef}
        className={prefix(
            "editor",
            showGuides ? "" : "hide-guides",
            darkMode ? "" : "light-mode",
        )}
        onDragOver={(e: DragEvent) => {
            e.preventDefault();
        }}
        onDrop={(e: DragEvent) => {
            e.preventDefault();

            const infiniteViewer = infiniteViewerRef.current!;
            const viewportElement = infiniteViewer.getViewport();
            const { left, top } = viewportElement.getBoundingClientRect();
            const zoom = zoomStore.value;
            const { clientX, clientY } = e;
            const offsetPosition = [
                (clientX - left) / zoom,
                (clientY - top) / zoom,
            ];
            readFiles(e, offsetPosition).then(result => {
                if (result.layers) {
                    setLayers([
                        ...layerManager.layers,
                        ...result.layers,
                    ], [
                        ...layerManager.groups,
                        ...result.groups!,
                    ]);
                }
            });
        }}
    >
        <ToolBar />
        <MenuList />
        <PanelGroup direction="horizontal">
            <Panel className="scena-panel-left">
                <Tabs tabs={leftTabs} />
            </Panel>
            <PanelResizeHandle className="scena-resize-handle" />
            <Panel defaultSize={70} className="scena-center">
                <div className="scena-canvas">
                    <div className={prefix("reset")} onClick={() => {
                        infiniteViewerRef.current!.scrollCenter({ duration: 500, absolute: true });
                    }}></div>
                    {showGuides && <GuidesManager ref={horizontalGuidesRef} type="horizontal" />}
                    {showGuides && <GuidesManager ref={verticalGuidesRef} type="vertical" />}
                    <InfiniteViewerManager ref={infiniteViewerRef}>
                        <Viewport ref={viewportRef} onBlur={onBlur}
                            style={{
                                width: `600px`,
                                height: `800px`,
                            }}>
                            <MoveableManager ref={moveableRef} />
                        </Viewport>
                    </InfiniteViewerManager>
                    <SelectoManager ref={selectoRef} />
                </div>
            </Panel>
            <PanelResizeHandle className="scena-resize-handle" />
            <Panel className="scena-panel-right" style={{
                overflow: "visible",
            }}>

                <Tabs tabs={rightTabs} />
                <ColorPickerPortal />
            </Panel>
        </PanelGroup>
    </EditorElement>, [showGuides, darkMode]);
}
