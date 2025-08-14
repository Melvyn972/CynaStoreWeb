import { useState, useEffect } from 'react';

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

export function useClientState(initialValue) {
  const [value, setValue] = useState(initialValue);
  const isHydrated = useHydration();

  return [isHydrated ? value : initialValue, setValue, isHydrated];
}
