import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient, PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

const CACHE_TIME = 5 * 60 * 1000;
const STALE_TIME = 30 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

const localStoragePersister = {
  persistClient: async (client: PersistQueryClientOptions['persister'] extends { persistClient: (client: infer T) => any } ? T : never) => {
    try {
      window.localStorage.setItem('cache', JSON.stringify(client));
    } catch (error) {
      console.error('Failed to persist query cache:', error);
    }
  },
  restoreClient: async () => {
    try {
      const cached = window.localStorage.getItem('cache');
      return cached ? JSON.parse(cached) : undefined;
    } catch (error) {
      console.error('Failed to restore query cache:', error);
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      window.localStorage.removeItem('cache');
    } catch (error) {
      console.error('Failed to remove query cache:', error);
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
      console.log(`🌐 API Call #${apiCallCount}:`, url);
    }
    return originalFetch(...args);
  };

  (window as any).resetApiCallCount = () => {
    apiCallCount = 0;
    console.log('✅ API call counter reset');
  };

  (window as any).getApiCallCount = () => {
    console.log(`📊 Total API calls: ${apiCallCount}`);
    return apiCallCount;
  };
}
