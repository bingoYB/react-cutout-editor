export declare enum EditorMode {
    /**查看 */
    View = "view",
    /**涂抹 */
    DrawLine = "drawLine",
    /**擦除 */
    Erase = "erase",
    /**框选 */
    FrameSelect = "select"
}
export declare enum HistoryAction {
    DrawLine = "drawLine",
    Reverse = "reverse",
    AddSelect = "select",
    AddMaskImage = "addMaskImage"
}
export interface HistoryRecord {
    action: HistoryAction;
    desc?: string;
    data?: DrawLineData | MaskImgData | null | undefined;
}
export type HistoryManage = {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    state: HistoryRecord;
    records: HistoryRecord[];
    push: (state: HistoryRecord) => void;
};
export interface DrawLineData {
    mode: EditorMode;
    strokeWidth: number;
    points: number[];
}
export interface MaskImgData {
    url: string;
    image: HTMLImageElement;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IPosition {
    x: number;
    y: number;
}
export interface ImageEditorRef {
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
    addMaskImageUrl: (url: string) => void;
    getMaskImage: () => Promise<string | undefined>;
    getProcessedImage: () => Promise<{
        img?: string;
        trimImg?: string;
    }>;
    setScale: (scale: number) => void;
}
