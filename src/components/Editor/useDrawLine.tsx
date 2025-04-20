import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DrawLineData, HistoryManage } from '../../types';
import { EditorMode, HistoryAction } from '../../types';

export type DrawLine = {
  points: number[];
};

export const isDrawLineMode = (mode: EditorMode) => {
  return mode === EditorMode.Erase || mode === EditorMode.DrawLine;
};

export function useDrawLine(mode: EditorMode, historyMng: HistoryManage, scale: number, drawLineWidth: number) {
  const isDrawingRef = useRef(false);
  const [currentLine, setCurrentLine] = useState<DrawLineData | null>(null);

  const strokeWidth = drawLineWidth;

  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      isDrawingRef.current = true;

      const pos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      if (pos) {
        setCurrentLine({
          mode,
          strokeWidth: strokeWidth / scale,
          points: [pos.x / scale, pos.y / scale],
        });

        setCursorPos({
          x: pos.x,
          y: pos.y,
        });
      }
    },
    [mode, strokeWidth, scale]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const pos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      if (pos) {
        setCursorPos({
          x: pos.x,
          y: pos.y,
        });
      }

      if (!isDrawingRef.current) return;

      if (pos) {
        setCurrentLine(prev => {
          if (!prev) return null;
          return {
            ...prev,
            points: [...prev.points, pos.x / scale, pos.y / scale],
          };
        });
      }
    },
    [scale]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawingRef.current || !currentLine) return;

    isDrawingRef.current = false;
    historyMng.push({
      action: HistoryAction.DrawLine,
      data: currentLine,
    });
    setCurrentLine(null);
  }, [currentLine, historyMng]);

  const handleMouseLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      // 设置cursorPos为null，避免鼠标移出画布时，画笔仍然显示圆形
      setCursorPos(null);

      if (!isDrawingRef.current) return;
      // 设置移出点位的坐标
      const pos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      if (pos) {
        setCurrentLine(prev => {
          if (!prev) return null;
          return {
            ...prev,
            points: [...prev.points, pos.x / scale, pos.y / scale],
          };
        });
      }
    },
    [scale]
  );

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  const brushCursor = useMemo(() => {
    if (!cursorPos) {
      return null;
    }

    const radius = strokeWidth / 2;
    const strokeSize = strokeWidth > 2 ? 1 : 0;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${strokeWidth + 2} ${strokeWidth + 2}`}
        width={strokeWidth + 2}
        height={strokeWidth + 2}
        style={{
          position: 'absolute',
          top: cursorPos?.y - radius - strokeSize,
          left: cursorPos?.x - radius - strokeSize,
          zIndex: 99,
          pointerEvents: 'none',
        }}>
        <circle cx={radius + strokeSize} cy={radius + strokeSize} r={radius} fill="rgba(255, 255, 255, 0.5)" stroke="white" strokeWidth={strokeSize} />
      </svg>
    );
  }, [cursorPos, strokeWidth]);

  return {
    isDrawing: isDrawingRef.current,
    currentLine,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    strokeWidth,
    brushCursor,
  };
}
