import { useCallback, useRef, useState } from 'react';
import { EditorMode, ImageEditorRef } from '../../types';

export interface EditorState {
  mode: EditorMode;
  lineWidth: number;
  scale: number;
  /**遮罩取反 */
  reverse?: boolean;
}

export function useEditorContextInit(initialState?: Partial<EditorState>) {
  const ref = useRef<ImageEditorRef | null>(null);

  // 统一管理编辑器状态
  const [state, setState] = useState<EditorState>({
    mode: EditorMode.DrawLine,
    lineWidth: 20,
    scale: 0,
    ...initialState,
  });

  // 状态更新方法
  const setMode = useCallback((mode: EditorMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setLineWidth = useCallback((lineWidth: number) => {
    setState(prev => ({ ...prev, lineWidth }));
  }, []);

  const setScale = useCallback((scale: number) => {
    setState(prev => ({ ...prev, scale }));
  }, []);

  const toggleReverse = useCallback(() => {
    setState(prev => ({ ...prev, reverse: !prev.reverse }));
  }, []);

  const undo = useCallback(() => {
    ref.current?.undo();
  }, []);

  const redo = useCallback(() => {
    ref.current?.redo();
  }, []);

  return {
    mode: state.mode,
    setMode,
    lineWidth: state.lineWidth,
    setLineWidth,
    reverse: state.reverse,
    toggleReverse,
    undo,
    redo,
    scale: state.scale,
    setScale,
    editorRef: ref,
  };
}
