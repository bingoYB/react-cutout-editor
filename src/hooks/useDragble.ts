import { useMemo, useState, type MouseEvent as ReactMouseEvent } from 'react';

export function useDragble() {
  // 添加位置状态
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleDragStart = (e: ReactMouseEvent<HTMLDivElement>) => {
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const style = useMemo(() => {
    return {
      transform: `translate(${position.x}px, ${position.y}px)`,
    };
  }, [position]);

  return { handleDragStart, style };
}
