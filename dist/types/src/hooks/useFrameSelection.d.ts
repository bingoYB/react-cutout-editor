import { type CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
interface Position {
    x: number;
    y: number;
}
interface DragSelectProps {
    onSelected?: (start: Position, end: Position) => void;
    showBorderAfterDrag?: boolean;
    borderClassName?: string;
    borderStyle?: CSSProperties;
}
export declare const useFrameSelection: ({ onSelected, showBorderAfterDrag, borderClassName, borderStyle }: DragSelectProps) => {
    onMouseDown: (e: ReactMouseEvent<HTMLDivElement>) => void;
    SelectionBorder: import("react/jsx-runtime").JSX.Element;
};
export {};
