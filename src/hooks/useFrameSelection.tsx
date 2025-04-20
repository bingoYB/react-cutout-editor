import { type CSSProperties, MouseEvent as ReactMouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DragSelectProps {
  onSelected?: (start: Position, end: Position) => void;
  showBorderAfterDrag?: boolean; // 是否在拖拽结束后保持边框显示
  borderClassName?: string;
  borderStyle?: CSSProperties;
}

export const useFrameSelection = ({ onSelected, showBorderAfterDrag = false, borderClassName, borderStyle }: DragSelectProps) => {
  const [borderPosition, setBorderPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    display: 'none',
  });

  const startPos = useRef<Position>({ x: 0, y: 0 });

  const removeRef = useRef<() => void>();

  function edgeLimit(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  const onMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const pos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      const bound = e.currentTarget.getBoundingClientRect();

      startPos.current = {
        x: pos.x,
        y: pos.y,
      };

      // 创建一个变量来跟踪拖拽状态
      let isDraggingNow = true;

      function onMouseMove(e: MouseEvent) {
        // 使用局部变量而不是 state
        if (!isDraggingNow) return;

        const currentPos = {
          x: edgeLimit(e.clientX - bound.x, 0, bound.width),
          y: edgeLimit(e.clientY - bound.y, 0, bound.height),
        };

        // 计算选择框的位置和大小
        const left = Math.min(startPos.current.x, currentPos.x);
        const top = Math.min(startPos.current.y, currentPos.y);
        const width = Math.abs(currentPos.x - startPos.current.x);
        const height = Math.abs(currentPos.y - startPos.current.y);

        setBorderPosition({
          left,
          top,
          width,
          height,
          display: 'block',
        });
      }

      function onMouseUp(e: MouseEvent) {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        // 使用局部变量而不是 state
        if (!isDraggingNow) return;

        isDraggingNow = false;

        const pos = {
          x: edgeLimit(e.clientX - bound.x, 0, bound.width),
          y: edgeLimit(e.clientY - bound.y, 0, bound.height),
        };

        // 有位置移动的时候才调用回调函数
        if (startPos.current.x !== pos.x || startPos.current.y !== pos.y) {
          // 拖拽结束，调用回调函数
          onSelected?.(startPos.current, pos);
        }

        if (!showBorderAfterDrag) {
          setBorderPosition(prev => ({ ...prev, display: 'none' }));
        } else {
          setBorderPosition(prev => ({ ...prev, display: 'block' }));
        }
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      removeRef.current = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    },
    [onSelected, showBorderAfterDrag] // 移除 isDragging 依赖
  );

  const SelectionBorder = useMemo(
    () => (
      <div
        className={borderClassName}
        style={{
          position: 'absolute',
          border: '2px solid #1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
          pointerEvents: 'none',
          zIndex: 999,
          ...borderStyle,
          ...borderPosition,
        }}
      />
    ),
    [borderClassName, borderPosition, borderStyle]
  );

  useEffect(() => {
    return () => {
      removeRef.current?.();
    };
  }, []);

  return {
    onMouseDown,
    // onMouseMove,
    // onMouseUp,
    // onMouseLeave,
    SelectionBorder,
  };
};
