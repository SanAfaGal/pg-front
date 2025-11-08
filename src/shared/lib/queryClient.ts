import { QueryClient, QueryClientConfig } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { logger } from '../utils/logger';

/**
 * React Query Configuration
 * 
 * Cache and stale time settings:
 * - STALE_TIME: 5 minutes - Data is considered fresh for 5 minutes, no automatic refetch needed
 * - CACHE_TIME: 5 minutes - Data remains in cache for 5 minutes after last use
 * 
 * Retry strategy:
 * - retry: 1 - Only retry failed requests once
 * 
 * Refetch behavior:
 * - refetchOnWindowFocus: false - No automatic refetch when window regains focus (manual refresh only)
 * - refetchOnMount: false - No automatic refetch when component mounts (manual refresh only)
 * - refetchOnReconnect: false - No automatic refetch when network reconnects (manual refresh only)
 * 
 * All data fetching is now manual via refresh buttons to reduce server load.
 */
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 5 * 60 * 1000; // 5 minutes - increased from 30 seconds

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
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
