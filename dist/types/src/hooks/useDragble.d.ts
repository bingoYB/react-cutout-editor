import { type MouseEvent as ReactMouseEvent } from 'react';
export declare function useDragble(): {
    handleDragStart: (e: ReactMouseEvent<HTMLDivElement>) => void;
    style: {
        transform: string;
    };
};
