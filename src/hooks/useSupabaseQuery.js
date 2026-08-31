import { useEffect, useRef, useState } from "react";

/**
 * Generic data-fetching hook: calls `fetcher()` (which must return {data, error})
 * once per dependency change, tracking loading/error state. Guards against
 * setting state after unmount.
 */
export function useSupabaseQuery(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setState((s) => ({ ...s, loading: true }));
    fetcher().then(({ data, error }) => {
      if (!mounted.current) return;
      setState({ data, loading: false, error });
    });
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
