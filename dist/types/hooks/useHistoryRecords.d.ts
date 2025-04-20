import { type HistoryRecord } from "../types";
export declare function useHistoryRecords<T extends HistoryRecord>(initialState?: T[]): {
    state: T;
    records: T[];
    push: (state: T) => void;
    undo: () => T;
    redo: () => T;
    canUndo: boolean;
    canRedo: boolean;
    clear: () => void;
};
