import { useCallback, useRef } from 'react';

export interface ChangeSignal {
  emit: () => void;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => number;
}

// A minimal pub-sub so the YAML preview can recompute on any form interaction
// without re-rendering the whole form tree on every keystroke.
export function useChangeSignal(): ChangeSignal {
  const version = useRef(0);
  const listeners = useRef(new Set<() => void>());

  const emit = useCallback(() => {
    version.current += 1;
    for (const listener of listeners.current) listener();
  }, []);

  const subscribe = useCallback((listener: () => void) => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  const getSnapshot = useCallback(() => version.current, []);

  return { emit, subscribe, getSnapshot };
}
