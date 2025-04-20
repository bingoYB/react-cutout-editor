import { ISize } from '../../types';
export declare function useImageRender(imgUrl: string, setScale: (scale: number) => void): {
    setScale: (scale: number) => void;
    img: HTMLImageElement | undefined;
    imageSize: ISize;
    containerRef: import("react").RefObject<HTMLDivElement>;
};
