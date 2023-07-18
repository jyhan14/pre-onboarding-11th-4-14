// useSessionStorage.ts
import { useEffect, useState } from 'react';

const useSessionStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default useSessionStorage;
