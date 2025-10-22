import { apiClient } from '../shared';

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

    return apiClient.post<FaceRegistrationResponse>(
      '/api/v1/face/register',
      payload
    );
  }

  static async updateFace(
    clientId: string,
    imageBase64: string
  ): Promise<FaceRegistrationResponse> {
    const payload: FaceUpdateRequest = {
      client_id: clientId,
      image_base64: imageBase64,
    };

    return apiClient.put<FaceRegistrationResponse>(
      '/api/v1/face/update',
      payload
    );
  }

  static async deleteFace(clientId: string): Promise<FaceDeleteResponse> {
    await apiClient.delete(`/api/v1/face/${clientId}`);
    return { success: true, message: 'Biometría eliminada exitosamente' };
  }

  static async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static async captureFromVideo(videoElement: HTMLVideoElement): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }

    ctx.drawImage(videoElement, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64 = dataUrl.split(',')[1];

    return base64;
  }
}
