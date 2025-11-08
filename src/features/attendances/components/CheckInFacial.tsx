import React, { useState, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { CameraCapture } from './CameraCapture';
import { CheckInResult } from './CheckInResult';
import { CheckInProcessingStatus } from './CheckInProcessingStatus';
import { useCheckIn } from '../hooks/useAttendances';
import { CheckInResponse } from '../types';
import { logger } from '../../../shared';
import { Camera } from 'lucide-react';

type ProcessingStage = 'idle' | 'uploading' | 'processing' | 'verifying' | 'finalizing' | 'completed';

export const CheckInFacial: React.FC = () => {
  const [checkInResult, setCheckInResult] = useState<CheckInResponse | null>(null);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');

  const { checkIn, reset } = useCheckIn();

  const handleImageCaptured = async (base64Image: string) => {
    setProcessingStage('uploading');
    setCheckInResult(null);
    
    try {
      // Stage 1: Uploading (simulated delay for better UX)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Stage 2: Processing facial recognition
      setProcessingStage('processing');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Stage 3: Verifying subscription
      setProcessingStage('verifying');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Stage 4: Finalizing
      setProcessingStage('finalizing');
      
      // Make actual API call
      const result = await checkIn(base64Image);
      
      // Stage 5: Completed
      setProcessingStage('completed');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setCheckInResult(result);
    } catch (err: unknown) {
      logger.error('Check-in failed:', err);
      
      let errorResult: CheckInResponse;
      const error = err as { type?: string; status?: number; message?: string; response?: { data?: { detail?: string } } };
      const errorType = error?.type;
      const status = error?.status;
      
      if (errorType === 'network') {
        errorResult = {
          success: false,
          message: 'Error de conexión',
          can_enter: false,
          reason: 'system_error',
          detail: 'No se pudo conectar al servidor. Por favor verifica tu conexión a internet e intenta de nuevo.',
        };
      } else if (errorType === 'timeout') {
        errorResult = {
          success: false,
          message: 'Tiempo de espera agotado',
          can_enter: false,
          reason: 'system_error',
          detail: 'La solicitud tardó demasiado tiempo. Por favor verifica tu conexión e intenta de nuevo.',
        };
      } else if (status && status > 0) {
        let apiMessage = '';
        let apiDetail = '';
        
        try {
          if (error.response?.data) {
            const errorData = error.response.data;
            apiMessage = errorData.message || errorData.detail || '';
            apiDetail = errorData.detail || '';
          }
        } catch (parseError) {
          logger.warn('Could not parse error response:', parseError);
        }
        
        if (status === 400) {
          errorResult = {
            success: false,
            message: apiMessage || 'No se detectó rostro en la imagen',
            can_enter: false,
            reason: 'no_face_detected',
            detail: apiDetail || 'Por favor asegúrate de que tu rostro esté claramente visible en el marco de la cámara e intenta de nuevo.',
          };
        } else if (status === 401) {
          errorResult = {
            success: false,
            message: apiMessage || 'Rostro no reconocido',
            can_enter: false,
            reason: 'face_not_recognized',
            detail: apiDetail || 'Tu rostro no fue reconocido en nuestro sistema. Por favor contacta a recepción para registrar tus datos faciales.',
          };
        } else if (status === 403) {
          errorResult = {
            success: false,
            message: apiMessage || 'Acceso denegado',
            can_enter: false,
            reason: 'subscription_expired',
            detail: apiDetail || 'El acceso al gimnasio está actualmente restringido. Por favor verifica el estado de tu suscripción.',
          };
        } else if (status === 409) {
          errorResult = {
            success: false,
            message: apiMessage || 'Ya has hecho check-in hoy',
            can_enter: false,
            reason: 'already_checked_in',
            detail: apiDetail || 'Ya has registrado tu entrada hoy. Solo puedes hacer check-in una vez por día.',
          };
        } else if (status === 422) {
          errorResult = {
            success: false,
            message: apiMessage || 'Error de validación',
            can_enter: false,
            reason: 'system_error',
            detail: apiDetail || 'Los datos enviados no son válidos. Por favor verifica la información e intenta de nuevo.',
          };
        } else if (status >= 500) {
          errorResult = {
            success: false,
            message: apiMessage || 'Error del servidor',
            can_enter: false,
            reason: 'system_error',
            detail: apiDetail || 'Error interno del servidor. Por favor intenta de nuevo más tarde.',
          };
        } else {
          errorResult = {
            success: false,
            message: apiMessage || 'Error del sistema',
            can_enter: false,
            reason: 'system_error',
            detail: apiDetail || 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
          };
        }
      } else {
        errorResult = {
          success: false,
          message: 'Error desconocido',
          can_enter: false,
          reason: 'system_error',
          detail: 'Ocurrió un error inesperado. Por favor intenta de nuevo o contacta al soporte técnico.',
        };
      }
      
      setCheckInResult(errorResult);
      setProcessingStage('completed');
    } finally {
      if (processingStage !== 'completed') {
        setProcessingStage('completed');
      }
    }
  };

  const handleRetry = useCallback(() => {
    setCheckInResult(null);
    setProcessingStage('idle');
    reset();
  }, [reset]);

  const handleError = useCallback((error: string) => {
    logger.error('Camera error:', error);
  }, []);

  // Determine what to show
  const showCamera = processingStage === 'idle' && !checkInResult;
  const showProcessing = processingStage !== 'idle' && processingStage !== 'completed' && !checkInResult;
  const showResult = checkInResult !== null;
  
  const processingStageForStatus = showProcessing 
    ? (processingStage === 'uploading' ? 'uploading' :
       processingStage === 'processing' ? 'processing' :
       processingStage === 'verifying' ? 'verifying' : 'finalizing')
    : 'uploading';

  return (
    <div className="w-full">
      {/* Single Column Flow */}
      <div className="space-y-6 w-full">
        {/* Camera Section - Only show when idle */}
        {showCamera && (
          <Card className="p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg border-2 border-blue-200 bg-white w-full">
            <div className="space-y-4 sm:space-y-6">
              
              <CameraCapture
                onImageCaptured={handleImageCaptured}
                onError={handleError}
                isProcessing={false}
              />
            </div>
          </Card>
        )}

        {/* Processing Status - Show during processing */}
        {showProcessing && (
          <CheckInProcessingStatus 
            stage={processingStageForStatus}
          />
        )}

        {/* Result Section - Show after completion */}
        {showResult && checkInResult && (
          <Card className="p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg border-2 w-full">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
                Resultado del Check-in
              </h2>
              <CheckInResult
                result={checkInResult}
                onRetry={handleRetry}
              />
            </div>
          </Card>
        )}

        {/* Empty State - Only show if nothing else is displayed */}
        {!showCamera && !showProcessing && !showResult && (
          <Card className="p-6 sm:p-8 lg:p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700 mb-1">Listo para Check-in</p>
                <p className="text-sm text-gray-500">Captura tu foto para comenzar el proceso</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
