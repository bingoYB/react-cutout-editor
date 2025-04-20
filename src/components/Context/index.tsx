import { createContext, useContext, ReactNode, type MutableRefObject } from 'react';
import { EditorMode, ImageEditorRef } from '../../types';
import { EditorState, useEditorContextInit } from './useEditorContext';

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

const EditorToolsContext = createContext<EditorToolsContextType | null>(null);

export function EditorContextProvider({ children, initialState }: { children: ReactNode; initialState?: Partial<EditorState> }) {
  const tools = useEditorContextInit(initialState);

  return <EditorToolsContext.Provider value={tools}>{children}</EditorToolsContext.Provider>;
}

export function useEditorContext() {
  const context = useContext(EditorToolsContext);
  if (!context) {
    throw new Error('useEditorToolsContext must be used within an EditorToolsProvider');
  }
  return context;
}
