import { useState, useCallback, useMemo, useEffect } from 'react';
import { type HistoryRecord } from '../types';

interface HistoryState<T> {
  records: T[];
  currentIndex: number;
}

export function useHistoryRecords<T extends HistoryRecord>(initialState?: T[]) {
  const [state, setState] = useState<HistoryState<T>>(() => ({
    records: initialState || [],
    currentIndex: initialState?.length ? initialState.length - 1 : -1,
  }));

  const push = useCallback((record: T) => {
    setState(prev => {
      const newRecords = prev.records.slice(0, prev.currentIndex + 1);
      newRecords.push(record);
      return {
        records: newRecords,
        currentIndex: prev.currentIndex + 1,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex >= 0) {
        return {
          ...prev,
          currentIndex: prev.currentIndex - 1,
        };
      }
      return prev;
    });
    return state.records[state.currentIndex - 1];
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex < prev.records.length - 1) {
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
        };
      }
      return prev;
    });
    return state.records[state.currentIndex + 1];
  }, []);

  const clear = useCallback(() => {
    setState({
      records: [],
      currentIndex: -1,
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    },
    [undo, redo]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const validRecords = useMemo(() => {
    return state.records.slice(0, state.currentIndex + 1);
  }, [state]);

  return useMemo(
    () => ({
      currentIndex: state.currentIndex,
      state: state.records[state.currentIndex],
      records: validRecords,
      push,
      undo,
      redo,
      canUndo: state.currentIndex >= 0,
      canRedo: state.currentIndex < state.records.length - 1,
      clear,
      all: state.records,
    }),
    [state, validRecords, push, undo, redo, clear]
  );
}
