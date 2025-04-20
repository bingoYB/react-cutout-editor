import { ReactNode, type MutableRefObject } from 'react';
import { EditorMode, ImageEditorRef } from '../../types';
import { EditorState } from './useEditorContext';
interface EditorToolsContextType {
    mode: EditorMode;
    setMode: (mode: EditorMode) => void;
    lineWidth: number;
    setLineWidth: (width: number) => void;
    reverse?: boolean;
    toggleReverse: () => void;
    scale: number;
    setScale: (scale: number) => void;
    editorRef: MutableRefObject<ImageEditorRef | null>;
    undo: () => void;
    redo: () => void;
}
export declare function EditorContextProvider({ children, initialState }: {
    children: ReactNode;
    initialState?: Partial<EditorState>;
}): import("react/jsx-runtime").JSX.Element;
export declare function useEditorContext(): EditorToolsContextType;
export {};
