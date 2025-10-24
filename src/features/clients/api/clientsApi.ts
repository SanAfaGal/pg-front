import { apiClient, API_ENDPOINTS } from '../../../shared/api/apiClient';
import { Client, ClientFormData, ClientFilters, ClientDashboardResponse, ClientStats } from '../types';

export const clientsApi = {
  async getClients(filters?: ClientFilters): Promise<Client[]> {
    return apiClient.get<Client[]>(API_ENDPOINTS.clients.list, {
      params: filters || {}
    });
  },

  async getClientById(id: string): Promise<Client> {
    return apiClient.get<Client>(API_ENDPOINTS.clients.detail(id));
  },

  async getClientDashboard(id: string): Promise<ClientDashboardResponse> {
    return apiClient.get<ClientDashboardResponse>(API_ENDPOINTS.clients.dashboard(id));
  },

  async createClient(clientData: ClientFormData): Promise<Client> {
    return apiClient.post<Client>(API_ENDPOINTS.clients.list, clientData);
  },

  async updateClient(id: string, clientData: Partial<ClientFormData>): Promise<Client> {
    return apiClient.put<Client>(API_ENDPOINTS.clients.detail(id), clientData);
  },

  async deleteClient(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.clients.detail(id));
  },

  async toggleClientStatus(id: string, isActive: boolean): Promise<Client> {
    return apiClient.put<Client>(API_ENDPOINTS.clients.detail(id), { is_active: isActive });
  },

  async checkDocumentExists(documentNumber: string, excludeId?: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        document_number: documentNumber,
      });

      if (excludeId) {
        params.append('exclude_id', excludeId);
      }

      const result = await apiClient.get<{ exists: boolean }>(
        `${API_ENDPOINTS.clients.list}/check-document?${params.toString()}`
      );

      return result.exists;
    } catch {
      return false;
    }
  },

  async uploadBiometric(id: string, photo: File): Promise<Client> {
    const formData = new FormData();
    formData.append('photo', photo);
    
    return apiClient.post<Client>(
      `${API_ENDPOINTS.clients.detail(id)}/biometric/`,
      formData,
      { isFormData: true }
    );
  },

  async registerFaceBiometric(clientId: string, imageBase64: string): Promise<void> {
    return apiClient.post('/face/register', {
      client_id: clientId,
      image_base64: imageBase64,
    });
  },

  async updateFaceBiometric(clientId: string, imageBase64: string): Promise<void> {
    return apiClient.put('/face/update', {
      client_id: clientId,
      image_base64: imageBase64,
    });
  },

  async getClientStats(): Promise<ClientStats> {
    return apiClient.get<ClientStats>('/clients/stats');
  },
};
