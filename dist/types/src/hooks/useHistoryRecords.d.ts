import { type HistoryRecord } from '../types';
export declare function useHistoryRecords<T extends HistoryRecord>(initialState?: T[]): {
    currentIndex: number;
    state: T;
    records: T[];
    push: (record: T) => void;
    undo: () => T;
    redo: () => T;
    canUndo: boolean;
    canRedo: boolean;
    clear: () => void;
    all: T[];
};
