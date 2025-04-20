import { useMemoFn } from '../src/hooks/index';
import { renderHook } from '@testing-library/react';

describe('useMemoFn', () => {
  // 测试基本功能
  it('should return memoized function', () => {
    const fn = jest.fn((x: number) => x * 2);
    const { result } = renderHook(() => useMemoFn(fn));

    const memoizedFn = result.current;
    expect(memoizedFn(2)).toBe(4);
    expect(fn).toHaveBeenCalledWith(2);
  });

  // 测试函数引用稳定性
  it('should keep stable reference', () => {
    const { result, rerender } = renderHook(({ fn }) => useMemoFn(fn), {
      initialProps: { fn: (x: number) => x * 2 },
    });

    const firstRef = result.current;
    rerender({ fn: (x: number) => x * 2 });
    expect(result.current).toBe(firstRef);
  });

  // 测试多参数函数
  it('should work with multiple arguments', () => {
    const fn = jest.fn((a: number, b: string) => `${a}-${b}`);
    const { result } = renderHook(() => useMemoFn(fn));

    expect(result.current(1, 'test')).toBe('1-test');
    expect(fn).toHaveBeenCalledWith(1, 'test');
  });

  // 测试异步函数
  it('should work with async functions', async () => {
    const fn = jest.fn(async (x: number) => x * 2);
    const { result } = renderHook(() => useMemoFn(fn));

    const value = await result.current(2);
    expect(value).toBe(4);
    expect(fn).toHaveBeenCalledWith(2);
  });

  // 测试函数更新
  it('should update function implementation', () => {
    const { result, rerender } = renderHook(({ fn }) => useMemoFn(fn), {
      initialProps: { fn: (x: number) => x * 2 },
    });

    expect(result.current(2)).toBe(4);

    rerender({ fn: (x: number) => x * 3 });
    expect(result.current(2)).toBe(6);
  });

  // 测试错误处理
  it('should handle function errors', () => {
    const errorFn = () => {
      throw new Error('test error');
    };
    const { result } = renderHook(() => useMemoFn(errorFn));

    expect(() => result.current()).toThrow('test error');
  });

  // 测试函数上下文
  it('should preserve this context', () => {
    const obj = {
      value: 42,
      method: function () {
        return this.value;
      },
    };

    const { result } = renderHook(() => useMemoFn(obj.method.bind(obj)));
    expect(result.current()).toBe(42);
  });
});
