import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { CameraCapture } from './CameraCapture';
import { CheckInResult } from './CheckInResult';
import { useCheckIn } from '../hooks/useAttendances';
import { CheckInResponse } from '../types';

export const CheckInFacial: React.FC = () => {
  const [checkInResult, setCheckInResult] = useState<CheckInResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { checkIn, isLoading, reset } = useCheckIn();

  const handleImageCaptured = async (base64Image: string) => {
    setIsProcessing(true);
    
    try {
      const result = await checkIn(base64Image);
      setCheckInResult(result);
    } catch (err: any) {
      console.error('Check-in failed:', err);
      
      // Handle different types of errors
      let errorResult: CheckInResponse;
      
      // Check error type and status
      const errorType = err?.type;
      const status = err?.status;
      
      if (errorType === 'network') {
        // Network connection error (no internet, server unreachable)
        errorResult = {
          success: false,
          message: 'Error de conexión',
          can_enter: false,
          reason: 'system_error',
          detail: 'No se pudo conectar al servidor. Por favor verifica tu conexión a internet e intenta de nuevo.',
        };
      } else if (errorType === 'timeout') {
        // Request timeout error
        errorResult = {
          success: false,
          message: 'Tiempo de espera agotado',
          can_enter: false,
          reason: 'system_error',
          detail: 'La solicitud tardó demasiado tiempo. Por favor verifica tu conexión e intenta de nuevo.',
        };
      } else if (status && status > 0) {
        // HTTP error with valid status code
        // Try to extract the actual error message from the API response
        let apiMessage = '';
        let apiDetail = '';
        
        try {
          // If the error has response data, use it
          if (err.response?.data) {
            const errorData = err.response.data;
            apiMessage = errorData.message || errorData.detail || '';
            apiDetail = errorData.detail || '';
          }
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
        }
        
        if (status === 400) {
          // No face detected - use API message if available
          errorResult = {
            success: false,
            message: apiMessage || 'No se detectó rostro en la imagen',
            can_enter: false,
            reason: 'no_face_detected',
            detail: apiDetail || 'Por favor asegúrate de que tu rostro esté claramente visible en el marco de la cámara e intenta de nuevo.',
          };
        } else if (status === 401) {
          // Face not recognized - use API message if available
          errorResult = {
            success: false,
            message: apiMessage || 'Rostro no reconocido',
            can_enter: false,
            reason: 'face_not_recognized',
            detail: apiDetail || 'Tu rostro no fue reconocido en nuestro sistema. Por favor contacta a recepción para registrar tus datos faciales.',
          };
        } else if (status === 403) {
          // Access denied - use API response data
          errorResult = {
            success: false,
            message: apiMessage || 'Acceso denegado',
            can_enter: false,
            reason: 'subscription_expired',
            detail: apiDetail || 'El acceso al gimnasio está actualmente restringido. Por favor verifica el estado de tu suscripción.',
          };
        } else if (status === 409) {
          // Already checked in today - use API response data
          errorResult = {
            success: false,
            message: apiMessage || 'Ya has hecho check-in hoy',
            can_enter: false,
            reason: 'already_checked_in',
            detail: apiDetail || 'Ya has registrado tu entrada hoy. Solo puedes hacer check-in una vez por día.',
          };
        } else if (status === 422) {
          // Validation error
          errorResult = {
            success: false,
            message: apiMessage || 'Error de validación',
            can_enter: false,
            reason: 'system_error',
            detail: apiDetail || 'Los datos enviados no son válidos. Por favor verifica la información e intenta de nuevo.',
          };
        } else if (status >= 500) {
          // Server error
          errorResult = {
            success: false,
            message: apiMessage || 'Error del servidor',
            can_enter: false,
            reason: 'system_error',
            detail: apiDetail || 'Error interno del servidor. Por favor intenta de nuevo más tarde.',
          };
        } else {
          // Other HTTP errors
          errorResult = {
            success: false,
            message: apiMessage || 'Error del sistema',
            can_enter: false,
            reason: 'system_error',
            detail: apiDetail || 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
          };
        }
      } else {
        // Unknown error type
        errorResult = {
          success: false,
          message: 'Error desconocido',
          can_enter: false,
          reason: 'system_error',
          detail: 'Ocurrió un error inesperado. Por favor intenta de nuevo o contacta al soporte técnico.',
        };
      }
      
      setCheckInResult(errorResult);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setCheckInResult(null);
    reset();
  };

  const handleError = (error: string) => {
    console.error('Camera error:', error);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check-in Facial</h1>
        <p className="text-gray-600">
          Usa el reconocimiento facial para hacer check-in en el gimnasio. Posiciona tu rostro dentro de la vista de la cámara y haz clic en capturar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Captura de Cámara</h2>
          <CameraCapture
            onImageCaptured={handleImageCaptured}
            onError={handleError}
            isProcessing={isProcessing || isLoading}
          />
        </Card>

        {/* Result Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resultado del Check-in</h2>
          {checkInResult ? (
            <CheckInResult
              result={checkInResult}
              onRetry={handleRetry}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-lg font-medium">Listo para Check-in</p>
                <p className="text-sm">Captura tu foto para comenzar el proceso de check-in</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
