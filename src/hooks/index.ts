import { useCallback, useMemo, useRef } from 'react';

export * from './useDragble';
export * from './useFrameSelection';
export * from './useHistoryRecords';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMemoFn<Args extends any[], Return>(fn: (...args: Args) => Return): (...args: Args) => Return {
  const ref = useRef<(...args: Args) => Return>(fn);

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  ref.current = useMemo(() => fn, [fn]);

  return useCallback((...args: Args) => ref.current(...args), []);
}
