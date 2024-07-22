import * as React from "react";
import { IObject } from "@daybrush/utils";
import { prefix } from "../utils/utils";
import { DATA_SCENA_ELEMENT_ID } from "../css";
import { $layerManager, $layers } from "../stores/stores";
import { ScenaElementLayer } from "../types";
import { useStoreStateValue } from "../store";

export interface ViewportProps {
    style: Record<string, any>;
    children?: React.ReactNode;
    onBlur: (e: any) => any;
}
export interface ViewportInstnace {

}

export interface ScenaLayerElementProps {
    layer: ScenaElementLayer;
}
export function ScenaLayerElement(props: ScenaLayerElementProps) {
    const layerManager = useStoreStateValue($layerManager);
    const layer = props.layer;
    const jsx = layer.jsx;
    const jsxProps: IObject<any> = {
        key: layer.id,
        ref: layer.ref,
    };

    React.useEffect(() => {
        const element = layer.ref.current!;

        layer.item.set(0, layer.style);
        element.style.cssText += layerManager.compositeFrame(layer).toCSSText();
    }, [layer.id]);

    return React.cloneElement(jsx, { ...jsx.props, ...jsxProps });
}
const Viewport = React.forwardRef<ViewportInstnace, ViewportProps>((props, ref) => {
    const {
        onBlur,
        style,
        children,
    } = props;
    const layers = useStoreStateValue($layers);

    React.useImperativeHandle(ref, () => {
        return {};
    }, []);

    return <div className={prefix("viewport-container")} onBlur={onBlur} style={style}>
        {children}
        <div className={prefix("viewport")} {...{ [DATA_SCENA_ELEMENT_ID]: "viewport" }}>
            {layers.map(layer => {
                return <ScenaLayerElement key={layer.id} layer={layer} />;
            })}
        </div>
    </div>;
});


Viewport.displayName = "Viewport";

export default Viewport;
