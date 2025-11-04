import { apiClient } from '../../../shared';

export interface FaceRegistrationRequest {
  client_id: string;
  image_base64: string;
}

export interface FaceUpdateRequest {
  client_id: string;
  image_base64: string;
}

export interface FaceRegistrationResponse {
  success: boolean;
  message: string;
  biometric_id: string;
  client_id: string;
}

export interface FaceDeleteResponse {
  success: boolean;
  message: string;
}

export class FaceRecognitionService {
  static async registerFace(
    clientId: string,
    imageBase64: string
  ): Promise<FaceRegistrationResponse> {
    const payload: FaceRegistrationRequest = {
      client_id: clientId,
      image_base64: imageBase64,
    };

    const response = await apiClient.post<FaceRegistrationResponse>(
      '/biometrics/register-face',
      payload
    );

    return response;
  }

  static async updateFace(
    clientId: string,
    imageBase64: string
  ): Promise<FaceRegistrationResponse> {
    const payload: FaceUpdateRequest = {
      client_id: clientId,
      image_base64: imageBase64,
    };

    const response = await apiClient.put<FaceRegistrationResponse>(
      '/biometrics/update-face',
      payload
    );

    return response;
  }

  static async deleteFace(clientId: string): Promise<FaceDeleteResponse> {
    const response = await apiClient.delete<FaceDeleteResponse>(
      `/biometrics/delete-face/${clientId}`
    );

    return response;
  }
}


