export declare function createTransparentGridPattern(ctx: CanvasRenderingContext2D, size: {
    width: number;
    height: number;
}): void;
export declare function getImageData(url: string): Promise<{
    width: number;
    height: number;
    img: HTMLImageElement;
}>;
export declare function hexToRgb(hex: string): [number, number, number] | null;
export declare function defaultIsMaskFn(r: number, g: number, b: number): boolean;
export declare function isSameColor(color1: [number, number, number], color2: [number, number, number]): boolean;
/**
 * 裁剪 Canvas 中的透明边界，只保留有内容的部分
 */
export declare function trimTransparent(canvas: HTMLCanvasElement | null): HTMLCanvasElement | undefined;
