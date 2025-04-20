import { renderHook } from '@testing-library/react';
import { useDragble } from '../src/hooks/useDragble';
import { act } from 'react';

describe('useDragble', () => {
  // 模拟 document.addEventListener 和 removeEventListener
  let mockAddEventListener: jest.SpyInstance;
  let mockRemoveEventListener: jest.SpyInstance;

  beforeEach(() => {
    mockAddEventListener = jest.spyOn(document, 'addEventListener');
    mockRemoveEventListener = jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default position and style', () => {
    const { result } = renderHook(() => useDragble());

    expect(result.current.style).toEqual({
      transform: 'translate(0px, 0px)',
    });
  });

  it('should handle drag start and update position on mouse move', () => {
    const { result } = renderHook(() => useDragble());

    // 模拟拖拽开始事件
    const mockMouseEvent = {
      clientX: 100,
      clientY: 100,
    };

    act(() => {
      // @ts-ignore
      result.current.handleDragStart(mockMouseEvent);
    });

    // 验证事件监听器是否被正确添加
    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
    expect(mockAddEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));

    // 触发 mousemove 事件
    const mouseMoveHandler = mockAddEventListener.mock.calls.find(call => call[0] === 'mousemove')[1];

    act(() => {
      mouseMoveHandler({ clientX: 150, clientY: 150 });
    });

    // 验证位置是否正确更新
    expect(result.current.style).toEqual({
      transform: 'translate(50px, 50px)',
    });
  });

  it('should remove event listeners on mouse up', () => {
    const { result } = renderHook(() => useDragble());

    // 模拟拖拽开始事件
    const mockMouseEvent = {
      clientX: 100,
      clientY: 100,
    };

    act(() => {
      // @ts-ignore
      result.current.handleDragStart(mockMouseEvent);
    });

    // 触发 mouseup 事件
    const mouseUpHandler = mockAddEventListener.mock.calls.find(call => call[0] === 'mouseup')[1];

    act(() => {
      mouseUpHandler();
    });

    // 验证事件监听器是否被正确移除
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
    expect(mockRemoveEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
  });

  it('should update style when position changes', () => {
    const { result } = renderHook(() => useDragble());

    // 模拟拖拽开始和移动
    const mockMouseEvent = {
      clientX: 100,
      clientY: 100,
    };

    act(() => {
      // @ts-ignore
      result.current.handleDragStart(mockMouseEvent);
    });

    const mouseMoveHandler = mockAddEventListener.mock.calls.find(call => call[0] === 'mousemove')[1];

    // 模拟多次移动
    act(() => {
      mouseMoveHandler({ clientX: 200, clientY: 200 });
    });

    expect(result.current.style).toEqual({
      transform: 'translate(100px, 100px)',
    });

    act(() => {
      mouseMoveHandler({ clientX: 150, clientY: 150 });
    });

    expect(result.current.style).toEqual({
      transform: 'translate(50px, 50px)',
    });
  });
});
