import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheOptions {
  key: string;
  ttl?: number; // Time to live in milliseconds
  retry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface RetryState {
  count: number;
  lastAttempt: number;
}

export function useCache<T>(
  fetchFunction: () => Promise<T>,
  options: CacheOptions
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const retryState = useRef<RetryState>({ count: 0, lastAttempt: 0 });
  const cacheKey = useRef(options.key);
  const fetchRef = useRef(fetchFunction);
  const inFlight = useRef(false);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    retry = true,
    maxRetries = 3,
    retryDelay = 1000,
  } = options;

  // Keep the latest fetchFunction without changing callback identities
  useEffect(() => {
    fetchRef.current = fetchFunction;
  }, [fetchFunction]);

  const fetchData = useCallback(async (isRetry = false) => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (isRetry) {
      retryState.current.count++;
      retryState.current.lastAttempt = Date.now();
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchRef.current();
      setData(result);
      retryState.current.count = 0; // Reset retry count on success
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);

      // Retry logic
      if (retry && retryState.current.count < maxRetries) {
        const delay = retryDelay * Math.pow(2, retryState.current.count); // Exponential backoff
        if (retryTimer.current) clearTimeout(retryTimer.current);
        retryTimer.current = setTimeout(() => {
          retryTimer.current = null;
          inFlight.current = false;
          fetchData(true);
        }, delay);
      }
    } finally {
      setLoading(false);
      // Allow subsequent fetches
      if (!retryTimer.current) {
        inFlight.current = false;
      }
    }
  }, [retry, maxRetries, retryDelay]);

  const refetch = useCallback(async () => {
    retryState.current.count = 0;
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Check if we have cached data
    const cachedData = localStorage.getItem(cacheKey.current);
    const cacheTimestamp = localStorage.getItem(`${cacheKey.current}_timestamp`);
    
    if (cachedData && cacheTimestamp) {
      const age = Date.now() - parseInt(cacheTimestamp);
      if (age < ttl) {
        try {
          setData(JSON.parse(cachedData));
          setLoading(false);
          return;
        } catch {
          // Invalid cached data, continue with fetch
        }
      }
    }

    fetchData();
  }, [fetchData, ttl]);

  // Save to cache when data changes
  useEffect(() => {
    if (data) {
      localStorage.setItem(cacheKey.current, JSON.stringify(data));
      localStorage.setItem(`${cacheKey.current}_timestamp`, Date.now().toString());
    }
  }, [data]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
