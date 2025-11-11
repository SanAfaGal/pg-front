// Centralized API Configuration and Client
import { logApiCall, logApiResponse, logger } from '../utils/logger';

// Environment Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000, // 30 seconds
  uploadTimeout: 60000, // 60 seconds
  disableAuth: import.meta.env.VITE_DISABLE_AUTH === 'true',
} as const;

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Auth 
  auth: {
    login: '/auth/token',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  
  // Clients
  clients: {
    list: '/clients/',
    detail: (id: string) => `/clients/${id}`,
    dashboard: (id: string) => `/clients/${id}/dashboard`,
    subscriptions: (id: string) => `/clients/${id}/subscriptions/`,
    activeSubscription: (id: string) => `/clients/${id}/subscriptions/active`,
  },
  
  // Plans
  plans: {
    list: '/plans/',
    detail: (id: string) => `/plans/${id}`,
  },
  
  // Subscriptions
  subscriptions: {
    list: (clientId: string) => `/clients/${clientId}/subscriptions/`,
    all: '/subscriptions/',
    detail: (id: string) => `/subscriptions/${id}`,
    renew: (clientId: string, id: string) => `/clients/${clientId}/subscriptions/${id}/renew`,
    cancel: (clientId: string, id: string) => `/clients/${clientId}/subscriptions/${id}/cancel`,
    expire: '/subscriptions/expire',
    activate: '/subscriptions/activate',
  },
  
  // Payments
  payments: {
    list: (subscriptionId: string) => `/subscriptions/${subscriptionId}/payments/`,
    stats: (subscriptionId: string) => `/subscriptions/${subscriptionId}/payments/stats`,
  },
  
  // Statistics
  statistics: '/statistics',
  
  // Attendances
  attendances: {
    checkIn: '/check-in',
    list: '/attendances',
    detail: (id: string) => `/attendances/${id}`,
    metrics: '/attendances/metrics',
    stats: '/attendances/stats',
  },

  // Inventory
  inventory: {
    // Products
    products: {
      list: '/inventory/products',
      detail: (id: string) => `/inventory/products/${id}`,
      search: '/inventory/products/search',
    },
    // Stock Management
    stock: {
      add: '/inventory/stock/add',
      remove: '/inventory/stock/remove',
    },
    // Movements
    movements: {
      list: '/inventory/movements',
      detail: (id: string) => `/inventory/movements/${id}`,
    },
    // Reports
    reports: {
      stats: '/inventory/reports/stats',
      lowStock: '/inventory/reports/low-stock',
      outOfStock: '/inventory/reports/out-of-stock',
      overstock: '/inventory/reports/overstock',
      productHistory: (id: string) => `/inventory/reports/products/${id}/history`,
      dailySales: '/inventory/reports/daily-sales',
      dailySalesByEmployee: '/inventory/reports/daily-sales-by-employee',
      reconciliation: '/inventory/reports/reconciliation',
    },
  },
} as const;

/**
 * Token Management class for handling authentication tokens
 * Manages access and refresh tokens in memory and localStorage
 */
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  /**
   * Set both access and refresh tokens
   * 
   * @param access - Access token string
   * @param refresh - Refresh token string
   */
  setTokens(access: string, refresh: string): void {
    this.accessToken = access;
    this.refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  /**
   * Get the current access token
   * 
   * @returns Access token string or null if not set
   */
  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('access_token');
    }
    return this.accessToken;
  }

  /**
   * Get the current refresh token
   * 
   * @returns Refresh token string or null if not set
   */
  getRefreshToken(): string | null {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem('refresh_token');
    }
    return this.refreshToken;
  }

  /**
   * Clear all tokens from memory and localStorage
   */
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export const tokenManager = new TokenManager();

// API Client Interface
interface ApiClient {
  get<T>(endpoint: string, config?: RequestConfig): Promise<T>;
  post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
  patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
}

interface RequestConfig {
  params?: Record<string, string | number | boolean>;
  isFormData?: boolean;
  timeout?: number;
}

// Real API Client Implementation
class RealApiClient implements ApiClient {
  private refreshPromise: Promise<string | null> | null = null;

  private isNetworkError(error: Error): boolean {
    // Check for common network error patterns
    return (
      error.name === 'TypeError' && (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('ERR_NETWORK') ||
        error.message.includes('ERR_INTERNET_DISCONNECTED') ||
        error.message.includes('ERR_CONNECTION_REFUSED') ||
        error.message.includes('ERR_NAME_NOT_RESOLVED')
      )
    );
  }

  private async makeRequest<T>(
    endpoint: string,
    method: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error(`API endpoint is required. Received: ${String(endpoint)}`);
    }
    const { params, isFormData = false, timeout = API_CONFIG.timeout } = config;
    
    // Build full URL
    let fullUrl = `${API_CONFIG.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
    }

    // Prepare headers
    const headers: HeadersInit = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Add authorization header
    if (!API_CONFIG.disableAuth) {
      const token = tokenManager.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Prepare body
    let body: string | FormData | undefined;
    if (data) {
      body = isFormData ? (data as FormData) : JSON.stringify(data);
    }

    logApiCall(method, fullUrl, data);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(fullUrl, {
        method,
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response, endpoint);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const responseData = await response.json();
      logApiResponse(method, responseData);
      return responseData;
    } catch (error) {
      // Handle different types of network errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Request was aborted due to timeout
          const timeoutError = new Error('Tiempo de espera agotado') as Error & {
            status: number;
            type: string;
            response: { data: null };
          };
          timeoutError.status = 0;
          timeoutError.type = 'timeout';
          timeoutError.response = { data: null };
          throw timeoutError;
        } else if (this.isNetworkError(error)) {
          // Network error (no internet, server down, etc.)
          const networkError = new Error('Error de conexión') as Error & {
            status: number;
            type: string;
            response: { data: null };
          };
          networkError.status = 0;
          networkError.type = 'network';
          networkError.response = { data: null };
          throw networkError;
        }
      }
      
      // Re-throw other errors as-is
      throw error;
    }
  }

  /**
   * Intenta refrescar el access token usando el refresh token
   * Reutiliza authApi.refreshToken para evitar duplicación de código
   * Usa Promise cache para evitar múltiples refreshes simultáneos
   */
  private async refreshAccessToken(): Promise<string | null> {
    // Si ya hay un refresh en progreso, reutilizar esa Promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    // Crear Promise cache para refreshes concurrentes
    this.refreshPromise = (async () => {
      try {
        // Reutilizar authApi.refreshToken existente
        const { authApi } = await import('../../features/auth/api/authApi');
        const tokens = await authApi.refreshToken(refreshToken);
        
        // Actualizar solo el access_token (el refresh_token no cambia)
        if (tokens.access_token) {
          const currentRefreshToken = tokenManager.getRefreshToken();
          if (currentRefreshToken) {
            tokenManager.setTokens(tokens.access_token, currentRefreshToken);
          }
          return tokens.access_token;
        }
        return null;
      } catch (error) {
        logger.error('Error refreshing token:', error);
        // Si el refresh falla, limpiar tokens
        tokenManager.clearTokens();
        return null;
      } finally {
        // Limpiar Promise cache después de completar
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async handleErrorResponse(response: Response, endpoint: string): Promise<never> {
    const status = response.status;
    
    // Handle authentication errors con refresh reactivo
    if (status === 401 && !endpoint.includes('/check-in') && !endpoint.includes('/logout') && !endpoint.includes('/auth/refresh')) {
      // Intentar refresh reactivo solo si hay refresh_token disponible
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        const newAccessToken = await this.refreshAccessToken();
        if (newAccessToken) {
          // Refresh exitoso - lanzar error controlado para que el componente pueda reintentar si es necesario
          // NO reintentamos automáticamente la petición original
          const refreshError = new Error('Token refreshed, please retry') as Error & {
            status: number;
            response: { data: { refreshed: boolean } };
          };
          refreshError.status = 401;
          refreshError.response = { data: { refreshed: true } };
          throw refreshError;
        }
      }
      
      // Si no hay refresh_token o el refresh falló, limpiar tokens
      tokenManager.clearTokens();
      throw new Error('Authentication failed');
    }

    // Try to parse error response
    let errorMessage = `HTTP error! status: ${status}`;
    let errorData: { detail?: string | Array<{ msg?: string; message?: string }>; message?: string } | null = null;
    
    try {
      const parsed = await response.json() as { detail?: string | Array<{ msg?: string; message?: string }>; message?: string };
      errorData = parsed;
      
      if (status === 422) {
        // Validation errors
        const details = parsed.detail;
        if (Array.isArray(details)) {
          errorMessage = details.map(d => d.msg || d.message).join(', ');
        } else if (typeof details === 'string') {
          errorMessage = details;
        }
      } else if (status === 400) {
        errorMessage = (typeof parsed.detail === 'string' ? parsed.detail : undefined) || parsed.message || 'Solicitud incorrecta';
      } else if (status === 401) {
        errorMessage = (typeof parsed.detail === 'string' ? parsed.detail : undefined) || parsed.message || 'No autorizado';
      } else if (status === 403) {
        errorMessage = (typeof parsed.detail === 'string' ? parsed.detail : undefined) || parsed.message || 'Acceso denegado';
      } else if (status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (status === 409) {
        errorMessage = (typeof parsed.detail === 'string' ? parsed.detail : undefined) || parsed.message || 'Conflicto - ya registrado';
      } else if (status === 500) {
        errorMessage = 'Error interno del servidor';
      }
    } catch {
      // If we can't parse the error response, use the default message
    }

    // Create a custom error that includes the response data
    const customError = new Error(errorMessage) as Error & {
      status: number;
      response: { data: unknown };
    };
    customError.status = status;
    customError.response = { data: errorData };
    
    throw customError;
  }

  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, 'GET', undefined, config);
  }

  async post<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, 'POST', data, config);
  }

  async put<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, 'PUT', data, config);
  }

  async patch<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, 'PATCH', data, config);
  }

  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, 'DELETE', undefined, config);
  }
}

// Mock API Client Implementation
class MockApiClient implements ApiClient {
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    logger.debug('Mock GET:', endpoint, config);
    
    // Import mock services dynamically to avoid circular dependencies
    const { mockGetActivePlans, mockGetPlanById } = await import('../../features/plans/data/mockPlans');
    const { 
      mockGetSubscriptions, 
      mockGetActiveSubscription, 
      mockGetPayments, 
      mockGetPaymentStats
    } = await import('../../features/subscriptions/data/mockSubscriptions');
    
    // Handle plans endpoints
    if (endpoint.includes('/plans/')) {
      if (endpoint.endsWith('/plans/') || endpoint.endsWith('/plans')) {
        const params = config.params || {};
        const limit = parseInt(String(params.limit)) || 100;
        const offset = parseInt(String(params.offset)) || 0;
        return mockGetActivePlans(limit, offset) as T;
      } else {
        const planId = endpoint.split('/').pop();
        if (planId) {
          return mockGetPlanById(planId) as T;
        }
      }
    }
    
    // Handle subscription endpoints
    if (endpoint.includes('/subscriptions/')) {
      const parts = endpoint.split('/');
      const clientId = parts[2];
      
      if (endpoint.includes('/active')) {
        return mockGetActiveSubscription(clientId) as T;
      } else if (endpoint.includes('/payments/stats')) {
        const subscriptionId = parts[2];
        return mockGetPaymentStats(subscriptionId) as T;
      } else if (endpoint.includes('/payments') && !endpoint.includes('/stats')) {
        const subscriptionId = parts[2];
        return mockGetPayments(subscriptionId) as T;
      } else {
        return mockGetSubscriptions(clientId) as T;
      }
    }
    
    return {} as T;
  }

  async post<T>(endpoint: string, data?: unknown, _config: RequestConfig = {}): Promise<T> {
    logger.debug('Mock POST:', endpoint, data);
    
    const { mockCreateSubscription, mockCreatePayment } = await import('../../features/subscriptions/data/mockSubscriptions');
    
    if (endpoint.includes('/subscriptions/') && !endpoint.includes('/payments')) {
      const parts = endpoint.split('/');
      const clientId = parts[2];
      return mockCreateSubscription(clientId, data) as T;
    } else if (endpoint.includes('/payments')) {
      const parts = endpoint.split('/');
      const subscriptionId = parts[2];
      return mockCreatePayment(subscriptionId, data) as T;
    }
    
    return {} as T;
  }

  async put<T>(endpoint: string, data?: unknown, _config: RequestConfig = {}): Promise<T> {
    logger.debug('Mock PUT:', endpoint, data);
    return { ...(data as object), updated_at: new Date().toISOString() } as T;
  }

  async patch<T>(endpoint: string, data?: unknown, _config: RequestConfig = {}): Promise<T> {
    logger.debug('Mock PATCH:', endpoint, data);
    return { ...(data as object), updated_at: new Date().toISOString() } as T;
  }

  async delete<T>(endpoint: string, _config: RequestConfig = {}): Promise<T> {
    logger.debug('Mock DELETE:', endpoint);
    return { success: true } as T;
  }
}

// Export the appropriate API client
// Use mock API if VITE_USE_MOCK_API is set, otherwise use real API
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
export const apiClient: ApiClient = useMockApi 
  ? new MockApiClient() 
  : new RealApiClient();

// Export token management functions for backward compatibility
export const setTokens = (access: string, refresh: string) => tokenManager.setTokens(access, refresh);
export const getAccessToken = () => tokenManager.getAccessToken();
export const getRefreshToken = () => tokenManager.getRefreshToken();
export const clearTokens = () => tokenManager.clearTokens();