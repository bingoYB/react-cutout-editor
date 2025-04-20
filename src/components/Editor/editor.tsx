import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Image as KnovaImage, Shape } from 'react-konva';
import Konva from 'konva';
import { isDrawLineMode, useDrawLine } from './useDrawLine';
import { useHistoryRecords } from '../../hooks/useHistoryRecords';
import { DrawLineData, EditorMode, HistoryAction, HistoryRecord, IPosition, MaskImgData } from '../../types';
import { createTransparentGridPattern, getImageData, hexToRgb, defaultIsMaskFn, trimTransparent, isSameColor } from './utils';
import { useFrameSelection } from '../../hooks/useFrameSelection';
import { useImageRender } from './useImageRender';
import { useDragble } from '../../hooks/useDragble';
import { EditorContainer, EditorPanel, ImageContainer } from './styles';
import { useEditorContext } from '../Context';
import { useMemoFn } from '@/src/hooks';

const MaxRenderWidth = 1200;

const CursorMod = {
  [EditorMode.DrawLine]: 'none',
  [EditorMode.FrameSelect]: 'crosshair',
  [EditorMode.View]: 'move',
  [EditorMode.Erase]: 'none',
};

// 一定要禁用，不然在多倍屏下会有不同的宽高尺寸渲染，导致数据计算混乱
Konva.pixelRatio = 1;

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
  // onCustomMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
  // onCustomMouseMove?: (e: MouseEvent<HTMLDivElement>) => void;
  // onCustomMouseUp?: (e: MouseEvent<HTMLDivElement>) => void;
  /**自定义判断mask图片是否是遮罩部分 */
  isMaskFn?: (r: number, g: number, b: number, a: number) => boolean;
}
export const EditorCore = (props: ImageEditorProps) => {
  const {
    imgUrl,
    maskImgUrl,
    maskColor = '#df4b26',
    maskOpacity = 0.5,
    onFrameSelected,
    // onCustomMouseDown,
    // onCustomMouseMove,
    // onCustomMouseUp,
    isMaskFn,
  } = props;

  const { mode, scale, setScale, lineWidth: drawLineWidth, reverse, editorRef } = useEditorContext();

  const historyMng = useHistoryRecords();

  // 添加位置状态
  const drag = useDragble();

  const { img, imageSize, containerRef } = useImageRender(imgUrl, setScale);

  const drawLine = useDrawLine(mode, historyMng, scale, drawLineWidth);

  const frameSelection = useFrameSelection({
    onSelected: onFrameSelected,
    showBorderAfterDrag: false,
  });

  const onMouseDown = useMemoFn((e: MouseEvent<HTMLDivElement>) => {
    switch (mode) {
      case EditorMode.DrawLine:
        drawLine.handleMouseDown(e);
        break;
      case EditorMode.Erase:
        drawLine.handleMouseDown(e);
        break;
      case EditorMode.FrameSelect:
        frameSelection.onMouseDown(e);
        break;
      case EditorMode.View:
        drag.handleDragStart(e);
        break;
      default:
        // onCustomMouseDown?.(e);
        break;
    }
  });

  const onMouseMove = useMemoFn((e: MouseEvent<HTMLDivElement>) => {
    switch (mode) {
      case EditorMode.DrawLine:
      case EditorMode.Erase:
        drawLine.handleMouseMove(e);
        break;
      default:
        // onCustomMouseMove?.(e);
        return;
    }
  });

  const onMouseUp = useMemoFn((e: MouseEvent<HTMLDivElement>) => {
    switch (mode) {
      case EditorMode.DrawLine:
      case EditorMode.Erase:
        drawLine.handleMouseUp();
        break;
      default:
        // onCustomMouseUp?.(e);
        return;
    }
  });

  const onMouseLeave = useMemoFn((e: MouseEvent<HTMLDivElement>) => {
    switch (mode) {
      case EditorMode.DrawLine:
        drawLine.handleMouseLeave(e);
        break;
      case EditorMode.Erase:
        drawLine.handleMouseLeave(e);
        break;
      default:
        // onCustomMouseLeave?.(e);
        return;
    }
  });

  const handleWheel = useMemoFn((e: WheelEvent) => {
    // 按住 Ctrl 键时才进行缩放
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.0001;
      const newScale = Math.min(Math.max(scale + delta, 0.001), 5);
      setScale(newScale);
    }
  });
  // 添加滚轮缩放事件
  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, [containerRef, handleWheel]);

  const renderImageSize = useMemo(() => {
    return {
      width: imageSize.width * scale,
      height: imageSize.height * scale,
    };
  }, [imageSize, scale]);

  const addMaskImageUrl = useMemoFn(async function addMaskImageUrl(url: string) {
    const data = await getImageData(url);
    historyMng.push({
      action: HistoryAction.AddMaskImage,
      data: {
        url,
        image: data.img,
      },
    });
  });

  useEffect(() => {
    if (maskImgUrl) {
      addMaskImageUrl(maskImgUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createCanvas = useCallback(
    (renderScale?: number) => {
      const size = imageSize;
      const canvas = document.createElement('canvas');
      const scale = renderScale || (size.width < MaxRenderWidth ? 1 : MaxRenderWidth / size.width);
      canvas.width = size.width * scale;
      canvas.height = size.height * scale;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('canvas context is null');
      }

      return {
        canvas,
        ctx,
        scale,
      };
    },
    [imageSize]
  );

  const renderLine = useCallback(
    (ctx: CanvasRenderingContext2D, data: DrawLineData, scale: number, reverse?: boolean) => {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = maskColor;

      if (reverse ? data.mode !== EditorMode.Erase : data.mode === EditorMode.Erase) {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      if (data.points.length < 2) {
        return;
      }

      ctx.lineWidth = data.strokeWidth * scale;
      ctx.beginPath();
      ctx.moveTo(data.points[0] * scale, data.points[1] * scale);
      for (let i = 2; i < data.points.length; i += 2) {
        ctx.lineTo(data.points[i] * scale, data.points[i + 1] * scale);
      }
      ctx.stroke();
    },
    [maskColor]
  );

  const renderMask = useCallback(
    (records: HistoryRecord[], renderScale?: number) => {
      const { canvas, ctx, scale } = createCanvas(renderScale);
      if (!ctx) return null;

      if (records.length === 0 && !drawLine.currentLine) return canvas;

      for (let i = 0; i < records.length; i++) {
        const item = records[i];
        let data = item.data;
        switch (item.action) {
          case HistoryAction.DrawLine:
            data = data as DrawLineData;
            renderLine(ctx, data, scale);
            break;
          case HistoryAction.AddMaskImage:
            data = data as MaskImgData;
            ctx.globalCompositeOperation = 'destination-over';
            ctx.drawImage(data.image, 0, 0, canvas.width, canvas.height);
            break;
          default:
            break;
        }
      }

      const maskColorRgba = hexToRgb(maskColor as string);
      if (!maskColorRgba) {
        return null;
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 默认白色区域为mask
      const judgeMaskFn = isMaskFn || defaultIsMaskFn;

      for (let i = 3; i < data.length; i += 4) {
        const isMask = judgeMaskFn(data[i - 3], data[i - 2], data[i - 1], data[i]) || isSameColor([data[i - 3], data[i - 2], data[i - 1]], maskColorRgba);
        if (reverse ? !isMask : isMask) {
          data[i - 3] = maskColorRgba[0];
          data[i - 2] = maskColorRgba[1];
          data[i - 1] = maskColorRgba[2];
          data[i] = 255;
        } else {
          data[i - 3] = 0;
          data[i - 2] = 0;
          data[i - 1] = 0;
          data[i] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas;
    },
    [createCanvas, drawLine.currentLine, maskColor, isMaskFn, renderLine, reverse]
  );

  const [maskCanva, setMaskCanva] = useState<HTMLCanvasElement | null>(null);
  const [processedCanva, setProcessedCanva] = useState<HTMLCanvasElement | null>(null);

  const renderProcessedImage = useCallback(
    function (img: HTMLImageElement, maskCanva: HTMLCanvasElement | null, renderScale?: number) {
      const { ctx, canvas } = createCanvas(renderScale);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'destination-out';

      if (!maskCanva) {
        return canvas;
      }

      ctx.drawImage(maskCanva, 0, 0, canvas.width, canvas.height);

      return canvas;
    },
    [createCanvas]
  );

  const historyMaskRef = useRef<HTMLCanvasElement | null>(null);
  // 渲染mask 和 处理后的图片
  useEffect(() => {
    if (historyMng.records.length === 0 || !renderImageSize.width || !img) {
      return;
    }
    const maskCanva = renderMask(historyMng.records);
    const processCanva = renderProcessedImage(img, maskCanva);
    historyMaskRef.current = maskCanva;
    setMaskCanva(maskCanva);
    setProcessedCanva(processCanva);
  }, [img, historyMng.records, drawLine.currentLine, renderMask, renderProcessedImage, renderImageSize.width]);

  useEffect(() => {
    if (drawLine.currentLine && img) {
      const { canvas, ctx, scale } = createCanvas();
      if (historyMaskRef.current) {
        ctx.drawImage(historyMaskRef.current, 0, 0, canvas.width, canvas.height);
      }
      renderLine(ctx, drawLine.currentLine, scale, reverse);
      setMaskCanva(canvas);
      const processCanva = renderProcessedImage(img, maskCanva);
      setProcessedCanva(processCanva);
    }
  }, [createCanvas, drawLine.currentLine, img, maskCanva, renderLine, renderProcessedImage, reverse]);

  useEffect(() => {
    if (editorRef) {
      editorRef.current = {
        async getMaskImage() {
          const canvas = renderMask(historyMng.records, 1);
          return canvas?.toDataURL('image/png');
        },
        async getProcessedImage() {
          if (!img) {
            throw new Error('img is null');
          }

          const maskCanva = renderMask(historyMng.records, 1);
          const canvas = renderProcessedImage(img, maskCanva, 1);

          // 生成处理后的图片，按照原图尺寸
          return {
            img: canvas?.toDataURL('image/png'),
            trimImg: trimTransparent(canvas)?.toDataURL('image/png'),
          };
        },
        addMaskImageUrl,
        clearHistory: historyMng.clear,
        undo: historyMng.undo,
        redo: historyMng.redo,
        setScale,
      };
    }
  }, [addMaskImageUrl, editorRef, historyMng, img, maskCanva, processedCanva, renderMask, renderProcessedImage, setScale]);

  return (
    <EditorContainer ref={containerRef}>
      {img && imageSize.width > 0 && imageSize.height > 0 && (
        <>
          <EditorPanel>
            <ImageContainer
              width={renderImageSize.width}
              height={renderImageSize.height}
              $isViewMode={mode === EditorMode.View}
              style={{ ...drag.style, cursor: CursorMod[mode] }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}>
              {isDrawLineMode(mode) && drawLine.brushCursor}
              {frameSelection.SelectionBorder}
              <Stage width={renderImageSize.width} height={renderImageSize.height}>
                <Layer>
                  <KnovaImage image={img} x={0} y={0} width={renderImageSize.width} height={renderImageSize.height} />
                </Layer>
                {/* Mask */}
                <Layer opacity={maskOpacity}>{maskCanva && <KnovaImage image={maskCanva} x={0} y={0} width={renderImageSize.width} height={renderImageSize.height} />}</Layer>
              </Stage>
            </ImageContainer>
          </EditorPanel>

          <EditorPanel>
            <ImageContainer
              width={renderImageSize.width}
              height={renderImageSize.height}
              $isViewMode={mode === EditorMode.View}
              style={drag.style}
              onMouseDown={e => {
                if (mode !== EditorMode.View) return;
                drag.handleDragStart(e);
              }}>
              {frameSelection.SelectionBorder}
              {isDrawLineMode(mode) && drawLine.brushCursor}
              <Stage width={renderImageSize.width} height={renderImageSize.height}>
                <Layer>
                  <Shape
                    sceneFunc={ctx => {
                      // 绘制网格背景，实现透明背景
                      createTransparentGridPattern(ctx as unknown as CanvasRenderingContext2D, renderImageSize);
                    }}></Shape>
                </Layer>
                <Layer>{processedCanva && <KnovaImage image={processedCanva} x={0} y={0} width={renderImageSize.width} height={renderImageSize.height} />}</Layer>
              </Stage>
            </ImageContainer>
          </EditorPanel>
        </>
      )}
    </EditorContainer>
  );
};
