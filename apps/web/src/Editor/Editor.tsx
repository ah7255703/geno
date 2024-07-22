import EditorManager from "./EditorManager";
import { StoreRoot } from "@scena/react-store";


export default function Editor() {
    return <StoreRoot>
        <EditorManager />
    </StoreRoot>;
}
