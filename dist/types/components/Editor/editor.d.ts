import { MouseEvent } from "react";
import { IPosition } from "../../types";
export interface ImageEditorProps {
    classname?: string;
    /**要处理的图片地址 */
    imgUrl: string;
    /**蒙层初始化图片 */
    maskImgUrl?: string;
    /**蒙层颜色 */
    maskColor?: string;
    /**蒙层透明度 */
    maskOpacity?: number;
    /**框选回调 */
    onFrameSelected?: (start: IPosition, end: IPosition) => void;
    onCustomMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
    onCustomMouseMove?: (e: MouseEvent<HTMLDivElement>) => void;
    onCustomMouseUp?: (e: MouseEvent<HTMLDivElement>) => void;
    /**自定义判断mask图片是否是遮罩部分 */
    isMaskFn?: (r: number, g: number, b: number, a: number) => boolean;
}
export declare const EditorCore: (props: ImageEditorProps) => import("react/jsx-runtime").JSX.Element;
