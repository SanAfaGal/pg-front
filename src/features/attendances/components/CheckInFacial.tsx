import React, { useState, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { CameraCapture } from './CameraCapture';
import { CheckInResult } from './CheckInResult';
import { useCheckIn } from '../hooks/useAttendances';
import { CheckInResponse } from '../types';
import { Camera, Loader2 } from 'lucide-react';

type ProcessingStage = 'idle' | 'capturing' | 'uploading' | 'processing' | 'verifying' | 'completed' | 'error';

export const CheckInFacial: React.FC = () => {
  const [checkInResult, setCheckInResult] = useState<CheckInResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [stageMessage, setStageMessage] = useState<string>('');

  const { checkIn, isLoading, reset } = useCheckIn();

  const updateProcessingStage = useCallback((stage: ProcessingStage, message: string) => {
    setProcessingStage(stage);
    setStageMessage(message);
  }, []);

  const handleImageCaptured = async (base64Image: string) => {
    setIsProcessing(true);
    setCheckInResult(null);
    
    try {
      // Stage 1: Capturing
      updateProcessingStage('capturing', 'Imagen capturada correctamente');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Stage 2: Uploading
      updateProcessingStage('uploading', 'Subiendo imagen al servidor...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Stage 3: Processing
      updateProcessingStage('processing', 'Procesando reconocimiento facial...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Stage 4: Verifying
      updateProcessingStage('verifying', 'Verificando suscripción y permisos...');
      
      // Make actual API call
      const result = await checkIn(base64Image);
      
      // Stage 5: Completed
      updateProcessingStage('completed', 'Proceso completado');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCheckInResult(result);
    } catch (err: any) {
      console.error('Check-in failed:', err);
      updateProcessingStage('error', 'Error en el proceso');
      
      // Handle different types of errors
      let errorResult: CheckInResponse;
      
      const errorType = err?.type;
      const status = err?.status;
      
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
          if (err.response?.data) {
            const errorData = err.response.data;
            apiMessage = errorData.message || errorData.detail || '';
            apiDetail = errorData.detail || '';
          }
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
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
    } finally {
      setIsProcessing(false);
      setProcessingStage('idle');
      setStageMessage('');
    }
  };

  const handleRetry = useCallback(() => {
    setCheckInResult(null);
    setProcessingStage('idle');
    setStageMessage('');
    reset();
  }, [reset]);

  const handleError = (error: string) => {
    console.error('Camera error:', error);
  };

  return (
    <div className="space-y-4">
      {/* Header - Compact */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-gray-900 mb-0.5 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          Check-in Facial
        </h1>
        <p className="text-xs text-gray-600">
          Captura tu foto para hacer check-in automático
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Camera Section */}
        <Card className="p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600" />
            Captura de Imagen
          </h2>
          <CameraCapture
            onImageCaptured={handleImageCaptured}
            onError={handleError}
            isProcessing={isProcessing || isLoading}
          />
        </Card>

        {/* Result & Status Section */}
        <Card className="p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Estado del Proceso</h2>
          
          {/* Processing Status - Always visible when processing */}
          {isProcessing && processingStage !== 'idle' && (
            <div className="mb-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-sm font-semibold text-blue-900">Procesando Check-in</span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-blue-800 font-medium">{stageMessage}</p>
                  <div className="w-full bg-blue-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: processingStage === 'capturing' ? '20%' :
                               processingStage === 'uploading' ? '40%' :
                               processingStage === 'processing' ? '60%' :
                               processingStage === 'verifying' ? '80%' :
                               processingStage === 'completed' ? '100%' : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Final Result */}
          <div className="overflow-hidden">
            {checkInResult ? (
              <CheckInResult
                result={checkInResult}
                onRetry={handleRetry}
              />
            ) : !isProcessing ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-0.5">Esperando Captura</p>
                    <p className="text-xs text-gray-500">Captura tu foto para comenzar</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
};
