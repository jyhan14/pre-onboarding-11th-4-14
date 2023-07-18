import { useRef } from 'react';

export function useDebounce<T>(callback: (...params: T[]) => void, time: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (...params: T[]) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      callback(...params);
      timer.current = null;
    }, time);
  };
}