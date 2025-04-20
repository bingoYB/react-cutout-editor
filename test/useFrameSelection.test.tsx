/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react';
import { useFrameSelection } from '../src/hooks/useFrameSelection';

describe('useFrameSelection', () => {
  const mockOnSelected = jest.fn();
  const defaultProps = {
    onSelected: mockOnSelected,
    showBorderAfterDrag: false,
    borderClassName: 'test-border',
    borderStyle: { backgroundColor: 'red' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default border position', () => {
    const { result } = renderHook(() => useFrameSelection(defaultProps));

    expect(result.current.SelectionBorder.props.style).toMatchObject({
      display: 'none',
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    });
  });

  it('should handle mouse down and move events', () => {
    const { result } = renderHook(() => useFrameSelection(defaultProps));

    const mockBoundingRect = {
      x: 0,
      y: 0,
      width: 500,
      height: 500,
    };

    const mouseDownEvent = {
      nativeEvent: {
        offsetX: 100,
        offsetY: 100,
      },
      currentTarget: {
        getBoundingClientRect: () => mockBoundingRect,
      },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    // 模拟鼠标移动
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 200,
      clientY: 200,
    });

    act(() => {
      window.dispatchEvent(mouseMoveEvent);
    });

    expect(result.current.SelectionBorder.props.style).toMatchObject({
      display: 'block',
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    });
  });

  it('should handle mouse up event and call onSelected', () => {
    const { result } = renderHook(() => useFrameSelection(defaultProps));

    const mockBoundingRect = {
      x: 0,
      y: 0,
      width: 500,
      height: 500,
    };

    const mouseDownEvent = {
      nativeEvent: {
        offsetX: 100,
        offsetY: 100,
      },
      currentTarget: {
        getBoundingClientRect: () => mockBoundingRect,
      },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    // 模拟鼠标抬起
    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: 200,
      clientY: 200,
    });

    act(() => {
      window.dispatchEvent(mouseUpEvent);
    });

    expect(mockOnSelected).toHaveBeenCalledWith({ x: 100, y: 100 }, { x: 200, y: 200 });

    // 验证边框是否隐藏（因为 showBorderAfterDrag 为 false）
    expect(result.current.SelectionBorder.props.style.display).toBe('none');
  });

  it('should keep border visible after drag when showBorderAfterDrag is true', () => {
    const { result } = renderHook(() => useFrameSelection({ ...defaultProps, showBorderAfterDrag: true }));

    const mockBoundingRect = {
      x: 0,
      y: 0,
      width: 500,
      height: 500,
    };

    const mouseDownEvent = {
      nativeEvent: {
        offsetX: 100,
        offsetY: 100,
      },
      currentTarget: {
        getBoundingClientRect: () => mockBoundingRect,
      },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: 200,
      clientY: 200,
    });

    act(() => {
      window.dispatchEvent(mouseUpEvent);
    });

    expect(result.current.SelectionBorder.props.style.display).toBe('block');
  });

  it('should limit selection within bounds', () => {
    const { result } = renderHook(() => useFrameSelection(defaultProps));

    const mockBoundingRect = {
      x: 0,
      y: 0,
      width: 500,
      height: 500,
    };

    const mouseDownEvent = {
      nativeEvent: {
        offsetX: 450,
        offsetY: 450,
      },
      currentTarget: {
        getBoundingClientRect: () => mockBoundingRect,
      },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    // 模拟超出边界的鼠标移动
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 600,
      clientY: 600,
    });

    act(() => {
      window.dispatchEvent(mouseMoveEvent);
    });

    // 验证选择框是否被限制在边界内
    expect(result.current.SelectionBorder.props.style.width).toBeLessThanOrEqual(500);
    expect(result.current.SelectionBorder.props.style.height).toBeLessThanOrEqual(500);
  });

  // 测试反向拖拽（从右下到左上）
  it('should handle reverse dragging', () => {
    const { result } = renderHook(() => useFrameSelection(defaultProps));
    const mockBoundingRect = { x: 0, y: 0, width: 500, height: 500 };

    const mouseDownEvent = {
      nativeEvent: { offsetX: 200, offsetY: 200 },
      currentTarget: { getBoundingClientRect: () => mockBoundingRect },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    });

    expect(result.current.SelectionBorder.props.style).toMatchObject({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    });
  });

  // 测试边界值
  it('should handle edge cases', () => {
    const { result } = renderHook(() => useFrameSelection(defaultProps));
    const mockBoundingRect = { x: 0, y: 0, width: 500, height: 500 };

    const mouseDownEvent = {
      nativeEvent: { offsetX: 0, offsetY: 0 },
      currentTarget: { getBoundingClientRect: () => mockBoundingRect },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: -100, clientY: -100 }));
    });

    expect(result.current.SelectionBorder.props.style).toMatchObject({
      left: 0,
      top: 0,
    });
  });

  // 测试自定义样式
  it('should apply custom styles correctly', () => {
    const customStyle = {
      backgroundColor: 'blue',
      border: '3px dashed red',
      opacity: 0.5,
    };

    const { result } = renderHook(() =>
      useFrameSelection({
        ...defaultProps,
        borderStyle: customStyle,
      })
    );

    expect(result.current.SelectionBorder.props.style).toMatchObject(customStyle);
  });

  // 测试快速点击（无拖动）
  it('should handle click without drag', () => {
    const { result } = renderHook(() => useFrameSelection(defaultProps));
    const mockBoundingRect = { x: 0, y: 0, width: 500, height: 500 };

    const mouseDownEvent = {
      nativeEvent: { offsetX: 100, offsetY: 100 },
      currentTarget: { getBoundingClientRect: () => mockBoundingRect },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseup', { clientX: 100, clientY: 100 }));
    });

    expect(mockOnSelected).not.toHaveBeenCalled();
  });

  // 测试事件清理
  it('should clean up event listeners', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { result } = renderHook(() => useFrameSelection(defaultProps));
    const mockBoundingRect = { x: 0, y: 0, width: 500, height: 500 };

    const mouseDownEvent = {
      nativeEvent: { offsetX: 100, offsetY: 100 },
      currentTarget: { getBoundingClientRect: () => mockBoundingRect },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseup', { clientX: 200, clientY: 200 }));
    });

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    removeEventListenerSpy.mockRestore();
  });

  // 测试无回调情况
  it('should work without onSelected callback', () => {
    const { result } = renderHook(() =>
      useFrameSelection({
        ...defaultProps,
        onSelected: undefined,
      })
    );
    const mockBoundingRect = { x: 0, y: 0, width: 500, height: 500 };

    const mouseDownEvent = {
      nativeEvent: { offsetX: 100, offsetY: 100 },
      currentTarget: { getBoundingClientRect: () => mockBoundingRect },
    } as any;

    expect(() => {
      act(() => {
        result.current.onMouseDown(mouseDownEvent);
        window.dispatchEvent(new MouseEvent('mouseup', { clientX: 200, clientY: 200 }));
      });
    }).not.toThrow();
  });

  // 测试 borderClassName
  it('should apply custom className', () => {
    const customClassName = 'custom-border';
    const { result } = renderHook(() =>
      useFrameSelection({
        ...defaultProps,
        borderClassName: customClassName,
      })
    );

    expect(result.current.SelectionBorder.props.className).toBe(customClassName);
  });

  // 测试鼠标离开事件
  it('should handle mouse leave during dragging', () => {
    const { result } = renderHook(() => useFrameSelection(defaultProps));
    const mockBoundingRect = { x: 0, y: 0, width: 500, height: 500 };

    const mouseDownEvent = {
      nativeEvent: { offsetX: 100, offsetY: 100 },
      currentTarget: { getBoundingClientRect: () => mockBoundingRect },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseleave'));
    });

    expect(result.current.SelectionBorder.props.style.display).toBe('none');
  });

  // 测试组件卸载时的清理
  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { result, unmount } = renderHook(() => useFrameSelection(defaultProps));
    const mockBoundingRect = { x: 0, y: 0, width: 500, height: 500 };

    const mouseDownEvent = {
      nativeEvent: { offsetX: 100, offsetY: 100 },
      currentTarget: { getBoundingClientRect: () => mockBoundingRect },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
      unmount();
    });

    expect(removeEventListenerSpy).toHaveBeenCalled();
    removeEventListenerSpy.mockRestore();
  });

  // 测试边界计算函数的所有分支
  it('should handle all edge limit cases', () => {
    const { result } = renderHook(() => useFrameSelection(defaultProps));
    const mockBoundingRect = { x: 0, y: 0, width: 500, height: 500 };

    const mouseDownEvent = {
      nativeEvent: { offsetX: 250, offsetY: 250 },
      currentTarget: { getBoundingClientRect: () => mockBoundingRect },
    } as any;

    act(() => {
      result.current.onMouseDown(mouseDownEvent);
    });

    // 测试各种边界情况
    const testCases = [
      { clientX: -100, clientY: -100, expected: { x: 0, y: 0 } },
      { clientX: 600, clientY: 600, expected: { x: 250, y: 250 } },
      { clientX: 250, clientY: 250, expected: { x: 250, y: 250 } },
      { clientX: 0, clientY: 500, expected: { x: 0, y: 250 } },
      { clientX: 500, clientY: 0, expected: { x: 250, y: 0 } },
    ];

    testCases.forEach(({ clientX, clientY, expected }) => {
      act(() => {
        window.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY }));
      });

      const style = result.current.SelectionBorder.props.style;

      expect(style.left).toBe(expected.x);

      expect(style.top).toBe(expected.y);
    });
  });
});
