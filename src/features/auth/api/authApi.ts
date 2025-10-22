import { apiClient, API_ENDPOINTS } from '../../../shared/api/apiClient';
import { User, LoginCredentials, AuthTokens } from '../types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${API_ENDPOINTS.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error de autenticación');
    }

    return response.json();
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.auth.me);
  },

  async logout(): Promise<void> {
    return apiClient.post(API_ENDPOINTS.auth.logout);
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return apiClient.post<AuthTokens>(API_ENDPOINTS.auth.refresh, {
      refresh_token: refreshToken,
    });
  },
};
