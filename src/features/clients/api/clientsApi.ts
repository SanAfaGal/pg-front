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
    return apiClient.patch(API_ENDPOINTS.clients.detail(id));
  },

  async toggleClientStatus(id: string, isActive: boolean): Promise<Client> {
    return apiClient.put<Client>(API_ENDPOINTS.clients.detail(id), { is_active: isActive });
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
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(clientId)) {
      throw new Error('Invalid client ID format. Expected UUID format.');
    }

    // Validate image base64
    if (!imageBase64 || imageBase64.trim().length === 0) {
      throw new Error('Image data cannot be empty');
    }

    // Basic base64 validation (should start with data:image/ or be pure base64)
    const base64Pattern = /^data:image\/(jpeg|jpg|png|webp);base64,/i;
    const isDataUri = base64Pattern.test(imageBase64);
    const isPureBase64 = /^[A-Za-z0-9+/=]+$/.test(imageBase64.replace(/\s/g, ''));
    
    if (!isDataUri && !isPureBase64) {
      throw new Error('Invalid image format. Expected base64 encoded image.');
    }

    // Extract pure base64 if it's a data URI
    const pureBase64 = isDataUri 
      ? imageBase64.split(',')[1] 
      : imageBase64.trim();

    if (!pureBase64 || pureBase64.length < 100) {
      throw new Error('Image data is too short. Please ensure the image was captured correctly.');
    }

    return apiClient.put('/face/update', {
      client_id: clientId,
      image_base64: pureBase64,
    });
  },

  async getClientStats(): Promise<ClientStats> {
    return apiClient.get<ClientStats>('/clients/stats');
  },
};
