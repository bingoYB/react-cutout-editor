import { EditorMode, ImageEditorRef } from "../../types";
export interface EditorState {
    mode: EditorMode;
    lineWidth: number;
    scale: number;
    reverse: boolean;
}
export declare function useEditorContextInit(initialState?: Partial<EditorState>): {
    mode: EditorMode;
    setMode: (mode: EditorMode) => void;
    lineWidth: number;
    setLineWidth: (lineWidth: number) => void;
    reverse: boolean;
    toggleReverse: () => void;
    undo: () => void;
    redo: () => void;
    scale: number;
    setScale: (scale: number) => void;
    editorRef: import("react").MutableRefObject<ImageEditorRef | null>;
};
