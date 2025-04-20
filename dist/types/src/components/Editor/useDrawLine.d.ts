import { MouseEvent } from 'react';
import type { DrawLineData, HistoryManage } from '../../types';
import { EditorMode } from '../../types';
export type DrawLine = {
    points: number[];
};
export declare const isDrawLineMode: (mode: EditorMode) => mode is EditorMode.DrawLine | EditorMode.Erase;
export declare function useDrawLine(mode: EditorMode, historyMng: HistoryManage, scale: number, drawLineWidth: number): {
    isDrawing: boolean;
    currentLine: DrawLineData | null;
    handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
    handleMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
    handleMouseUp: () => void;
    handleMouseLeave: (e: MouseEvent<HTMLDivElement>) => void;
    strokeWidth: number;
    brushCursor: import("react/jsx-runtime").JSX.Element | null;
};
