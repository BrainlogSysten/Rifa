
import { useState, useEffect, useCallback, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });
  
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFunction();
      
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
        onSuccess?.(result);
      }
      
      return result;
    } catch (error) {
      const err = error as Error;
      
      if (isMountedRef.current) {
        setState({ data: null, loading: false, error: err });
        onError?.(err);
      }
      
      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isIdle: !state.loading && !state.data && !state.error,
    isLoading: state.loading,
    isSuccess: !state.loading && !!state.data && !state.error,
    isError: !state.loading && !!state.error,
  };
}

export default useAsync;