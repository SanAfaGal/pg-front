/**
 * Mock implementation of API Client for testing
 */
import { vi } from 'vitest';

export interface MockApiResponse<T = any> {
  data: T;
  success?: boolean;
  message?: string;
}

class MockApiClient {
  private mockResponses: Map<string, MockApiResponse> = new Map();
  private mockErrors: Map<string, Error> = new Map();
  private callLog: Array<{ method: string; url: string; data?: any }> = [];

  /**
   * Set a mock response for a specific endpoint and method
   */
  setMockResponse<T>(method: string, url: string, response: T): void {
    const key = `${method.toUpperCase()}:${url}`;
    this.mockResponses.set(key, { data: response, success: true });
  }

  /**
   * Set a mock error for a specific endpoint and method
   */
  setMockError(method: string, url: string, error: Error): void {
    const key = `${method.toUpperCase()}:${url}`;
    this.mockErrors.set(key, error);
  }

  /**
   * Get call log
   */
  getCallLog(): Array<{ method: string; url: string; data?: any }> {
    return this.callLog;
  }

  /**
   * Clear call log
   */
  clearCallLog(): void {
    this.callLog = [];
  }

  /**
   * Clear all mocks
   */
  clearMocks(): void {
    this.mockResponses.clear();
    this.mockErrors.clear();
    this.callLog = [];
  }

  async get<T>(endpoint: string): Promise<T> {
    const key = `GET:${endpoint}`;
    this.callLog.push({ method: 'GET', url: endpoint });

    if (this.mockErrors.has(key)) {
      throw this.mockErrors.get(key);
    }

    const response = this.mockResponses.get(key);
    if (response) {
      return response.data as T;
    }

    // Default mock response
    return {} as T;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const key = `POST:${endpoint}`;
    this.callLog.push({ method: 'POST', url: endpoint, data });

    if (this.mockErrors.has(key)) {
      throw this.mockErrors.get(key);
    }

    const response = this.mockResponses.get(key);
    if (response) {
      return response.data as T;
    }

    // Default mock response
    return { id: 'mock-id', ...data } as T;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const key = `PUT:${endpoint}`;
    this.callLog.push({ method: 'PUT', url: endpoint, data });

    if (this.mockErrors.has(key)) {
      throw this.mockErrors.get(key);
    }

    const response = this.mockResponses.get(key);
    if (response) {
      return response.data as T;
    }

    return { ...data } as T;
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const key = `PATCH:${endpoint}`;
    this.callLog.push({ method: 'PATCH', url: endpoint, data });

    if (this.mockErrors.has(key)) {
      throw this.mockErrors.get(key);
    }

    const response = this.mockResponses.get(key);
    if (response) {
      return response.data as T;
    }

    return { ...data } as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const key = `DELETE:${endpoint}`;
    this.callLog.push({ method: 'DELETE', url: endpoint });

    if (this.mockErrors.has(key)) {
      throw this.mockErrors.get(key);
    }

    const response = this.mockResponses.get(key);
    if (response) {
      return response.data as T;
    }

    return {} as T;
  }
}

export const mockApiClient = new MockApiClient();

// Export factory function for creating fresh mocks
export const createMockApiClient = () => new MockApiClient();

