import { EditorMode, ImageEditorRef } from '../../types';
export interface EditorState {
    mode: EditorMode;
    lineWidth: number;
    scale: number;
    /**遮罩取反 */
    reverse?: boolean;
}
export declare function useEditorContextInit(initialState?: Partial<EditorState>): {
    mode: EditorMode;
    setMode: (mode: EditorMode) => void;
    lineWidth: number;
    setLineWidth: (lineWidth: number) => void;
    reverse: boolean | undefined;
    toggleReverse: () => void;
    undo: () => void;
    redo: () => void;
    scale: number;
    setScale: (scale: number) => void;
    editorRef: import("react").MutableRefObject<ImageEditorRef | null>;
};
