import { QueryClient, QueryClientConfig } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { logger } from '../utils/logger';

/**
 * React Query Configuration
 * 
 * Cache and stale time settings:
 * - STALE_TIME: 30 seconds - Data is considered fresh for 30s, no refetch needed
 * - CACHE_TIME: 5 minutes - Data remains in cache for 5 minutes after last use
 * 
 * Retry strategy:
 * - retry: 1 - Only retry failed requests once
 * 
 * Refetch behavior:
 * - refetchOnWindowFocus: true - Refetch when window regains focus (good for keeping data fresh)
 * - refetchOnMount: true - Refetch when component mounts (ensures latest data)
 * - refetchOnReconnect: true - Refetch when network reconnects
 */
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 30 * 1000; // 30 seconds

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      // Error handling - errors are handled at component level via onError callbacks
    },
    mutations: {
      // Global mutation error handling can be added here if needed
      retry: 0, // Don't retry mutations by default
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);

const localStoragePersister = {
  persistClient: async (client: unknown) => {
    try {
      window.localStorage.setItem('cache', JSON.stringify(client));
    } catch (error) {
      logger.error('Failed to persist query cache:', error);
    }
  },
  restoreClient: async () => {
    try {
      const cached = window.localStorage.getItem('cache');
      return cached ? JSON.parse(cached) : undefined;
    } catch (error) {
      logger.error('Failed to restore query cache:', error);
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      window.localStorage.removeItem('cache');
    } catch (error) {
      logger.error('Failed to remove query cache:', error);
    }
  },
};

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: CACHE_TIME,
});

if (import.meta.env.DEV) {
  let apiCallCount = 0;
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const url = args[0]?.toString() || '';
    if (url.includes('/api/')) {
      apiCallCount++;
      logger.debug(`🌐 API Call #${apiCallCount}:`, url);
    }
    return originalFetch(...args);
  };

  (window as Window & { resetApiCallCount?: () => void }).resetApiCallCount = () => {
    apiCallCount = 0;
    logger.debug('✅ API call counter reset');
  };

  (window as Window & { getApiCallCount?: () => number }).getApiCallCount = () => {
    logger.debug(`📊 Total API calls: ${apiCallCount}`);
    return apiCallCount;
  };
}
