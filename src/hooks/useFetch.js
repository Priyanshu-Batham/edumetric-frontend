import { useState, useEffect, useCallback } from 'react';

export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { data, loading, error, refetch: execute };
}

export function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (fn, { onSuccess, onError } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      onSuccess?.(result);
      return result;
    } catch (e) {
      setError(e.message);
      onError?.(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, run };
}
