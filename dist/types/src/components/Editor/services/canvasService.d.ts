import { DrawLineData } from '../../../types';
export declare class CanvasService {
    static createCanvas(width: number, height: number): HTMLCanvasElement;
    static renderLine(ctx: CanvasRenderingContext2D, data: DrawLineData, scale: number, maskColor: string): void;
    static processImageData(imageData: ImageData, maskData: ImageData | undefined, options: {
        maskColorRgba: number[];
        maskOpacity: number;
        reverse: boolean;
        isMaskFn: (r: number, g: number, b: number, a: number) => boolean;
    }): ImageData;
}
