import { act } from 'react';
import { useHistoryRecords } from '../src/hooks/useHistoryRecords';
import { EditorMode, HistoryAction, type HistoryRecord } from '../src/types';
import { renderHook } from '@testing-library/react';

function createHistoryRecord(data: number): HistoryRecord {
  return {
    action: HistoryAction.DrawLine,
    data: {
      mode: EditorMode.DrawLine,
      strokeWidth: data,
      points: [10, 10, 20, 20],
    },
  };
}

describe('useHistoryRecords', () => {
  let mockPreventDefault: jest.Mock;

  beforeEach(() => {
    mockPreventDefault = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useHistoryRecords<HistoryRecord>());

    expect(result.current.state).toBeUndefined();
    expect(result.current.records).toEqual([]);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should initialize with initial state', () => {
    const initialState: HistoryRecord[] = [createHistoryRecord(1), createHistoryRecord(2)];

    const { result } = renderHook(() => useHistoryRecords<HistoryRecord>(initialState));

    expect(result.current.records).toEqual(initialState);
  });

  it('should push new records and update state', () => {
    const { result } = renderHook(() => useHistoryRecords<HistoryRecord>());

    act(() => {
      result.current.push(createHistoryRecord(1));
    });

    expect(result.current.state).toEqual(createHistoryRecord(1));
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should handle undo and redo operations', () => {
    const { result } = renderHook(() => useHistoryRecords<HistoryRecord>());

    act(() => {
      result.current.push(createHistoryRecord(1));
      result.current.push(createHistoryRecord(2));
      result.current.push(createHistoryRecord(3));
    });

    // Test undo
    act(() => {
      result.current.undo();
    });

    // console.log('currentIndex', result.current.currentIndex);

    expect(result.current.state).toEqual(createHistoryRecord(2));
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);

    // Test redo
    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toEqual(createHistoryRecord(3));
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useHistoryRecords<HistoryRecord>());

    act(() => {
      result.current.push(createHistoryRecord(1));
      result.current.push(createHistoryRecord(2));
      result.current.clear();
    });

    expect(result.current.state).toBeUndefined();
    expect(result.current.records).toEqual([]);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should handle keyboard shortcuts', () => {
    const { result } = renderHook(() => useHistoryRecords<HistoryRecord>());

    act(() => {
      result.current.push(createHistoryRecord(1));
      result.current.push(createHistoryRecord(2));
    });

    // Test Ctrl+Z (undo)
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
      });
      // @ts-ignore
      event.preventDefault = mockPreventDefault;
      window.dispatchEvent(event);
    });

    expect(result.current.state).toEqual(createHistoryRecord(1));
    expect(mockPreventDefault).toHaveBeenCalled();

    // Test Ctrl+Y (redo)
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'y',
        ctrlKey: true,
      });
      // @ts-ignore
      event.preventDefault = mockPreventDefault;
      window.dispatchEvent(event);
    });

    expect(result.current.state).toEqual(createHistoryRecord(2));
  });

  it('should truncate future history when pushing after undo', () => {
    const { result } = renderHook(() => useHistoryRecords<HistoryRecord>());

    act(() => {
      result.current.push(createHistoryRecord(1));
      result.current.push(createHistoryRecord(2));
      result.current.push(createHistoryRecord(3));
      result.current.undo();
      result.current.undo();
      result.current.push(createHistoryRecord(4));
    });

    expect(result.current.records).toEqual([createHistoryRecord(1), createHistoryRecord(4)]);
    expect(result.current.canRedo).toBe(false);
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useHistoryRecords<HistoryRecord>());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
