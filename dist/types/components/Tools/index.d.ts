interface ToolControlPanelProps {
    minZoom?: number;
    maxZoom?: number;
    step?: number;
    onDownload?: () => void;
    className?: string;
}
export declare function ToolControlPanel({ minZoom, maxZoom, step, className, }: ToolControlPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
