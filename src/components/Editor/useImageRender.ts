import { useCallback, useEffect, useRef, useState } from 'react';
import useImage from 'use-image';
import { ISize } from '../../types';
export function useImageRender(imgUrl: string, setScale: (scale: number) => void) {
  const [img] = useImage(imgUrl, 'anonymous');
  /**容器dom */
  const containerRef = useRef<HTMLDivElement>(null);

  const [imageSize, setImageSize] = useState<ISize>({
    width: 0,
    height: 0,
  });

  // 根据容器大小、图片大小计算自适应的缩放比例
  const computeScale = useCallback((imageSize: ISize, containerSize: ISize) => {
    if (imageSize.width === 0 || imageSize.height === 0 || containerSize.width === 0 || containerSize.height === 0) {
      return 1;
    }

    // 计算宽度和高度的缩放比例
    const scaleX = containerSize.width / imageSize.width;
    const scaleY = containerSize.height / imageSize.height;

    // 使用较小的缩放比例，确保图片完全适应容器且保持宽高比
    return Math.min(scaleX, scaleY);
  }, []);

  // 初始化图片缩放比例，图片尺寸
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const imageSize = {
        width: img?.width || 0,
        height: img?.height || 0,
      };
      const scale = computeScale(imageSize, {
        width: container.clientWidth / 2 - 24,
        height: container.clientHeight - 24,
      });
      setScale(scale);
      setImageSize(imageSize);
    }
  }, [computeScale, img, setScale]);

  // 监听窗口尺寸变化，自动设置图片缩放大小
  useEffect(() => {
    const onResize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setScale(
          computeScale(imageSize, {
            width: container.clientWidth / 2 - 24,
            height: container.clientHeight - 24,
          })
        );
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [computeScale, imageSize, setScale]);

  return {
    setScale,
    img,
    imageSize,
    containerRef,
  };
}
