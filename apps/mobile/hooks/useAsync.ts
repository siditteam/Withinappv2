import { useEffect, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

export function useAsync<T>(factory: () => Promise<T>, deps: ReadonlyArray<unknown>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: false });

    factory()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ data: null, loading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
}
