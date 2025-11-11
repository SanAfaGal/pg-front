import React, { useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useCamera } from '../../features/attendances/hooks/useCamera';
import { useToast } from '../../shared';
import { useRegisterFaceBiometric, useUpdateFaceBiometric, type BiometricData } from '../../features/clients';

interface FacialRegisterFormProps {
  clientId: string;
  clientName: string;
  biometric?: BiometricData;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FacialRegisterForm: React.FC<FacialRegisterFormProps> = ({
  clientId,
  onSuccess,
  onCancel,
  biometric,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const { showToast } = useToast();

  const hasExistingBiometric = biometric?.has_face_biometric;

  const registerMutation = useRegisterFaceBiometric();
  const updateMutation = useUpdateFaceBiometric();

  const isSubmitting = registerMutation.isPending || updateMutation.isPending;

  const {
    videoRef,
    isStreaming,
    startCamera,
    stopCamera,
    captureImage,
    error: cameraError,
  } = useCamera();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = async () => {
    if (isSubmitting || !isStreaming) return;

    try {
      setIsDetecting(true);
      const base64 = await captureImage();

      if (hasExistingBiometric) {
        await updateMutation.mutateAsync({ clientId, imageBase64: base64 });
        showToast({
          type: 'success',
          title: 'Éxito',
          message: 'Biometría facial actualizada correctamente'
        });
      } else {
        await registerMutation.mutateAsync({ clientId, imageBase64: base64 });
        showToast({
          type: 'success',
          title: 'Éxito',
          message: 'Biometría facial registrada correctamente'
        });
      }

      stopCamera();
      onSuccess();
    } catch (error) {
      let errorMessage = 'Error al procesar la imagen';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more user-friendly messages for common errors
        if (error.message.includes('Invalid client ID format')) {
          errorMessage = 'ID de cliente inválido. Por favor, recarga la página e intenta de nuevo.';
        } else if (error.message.includes('Image data cannot be empty')) {
          errorMessage = 'La imagen capturada está vacía. Por favor, intenta capturar nuevamente.';
        } else if (error.message.includes('Invalid image format')) {
          errorMessage = 'Formato de imagen inválido. Por favor, intenta capturar nuevamente.';
        } else if (error.message.includes('too short')) {
          errorMessage = 'La imagen capturada es demasiado pequeña. Por favor, asegúrate de que tu rostro esté completamente visible.';
        } else if (error.message.includes('Client not found')) {
          errorMessage = 'Cliente no encontrado. Por favor, verifica la información del cliente.';
        } else if (error.message.includes('Client is not active')) {
          errorMessage = 'El cliente no está activo. Por favor, contacta al administrador.';
        } else if (error.message.includes('Internal server error')) {
          errorMessage = 'Error del servidor. Por favor, intenta de nuevo más tarde.';
        } else if (error.message.includes('no face detected') || error.message.includes('No face detected')) {
          errorMessage = 'No se detectó un rostro en la imagen. Por favor, asegúrate de que tu rostro esté claramente visible y bien iluminado.';
        }
      }
      
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
      setIsDetecting(false);
    }
  };

  // Error handling
  if (cameraError) {
    return (
      <Card className="p-8 bg-red-50 border-red-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Error al acceder a la cámara</h3>
            <p className="text-sm text-red-700 mb-4">
              {cameraError.message || 'No se pudo acceder a la cámara. Por favor, verifica los permisos.'}
            </p>
            <Button onClick={onCancel} variant="outline">
              Cerrar
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="bg-white p-8">
      <div className="space-y-6">
        {/* Video Container */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            {/* Video en forma circular con diseño moderno */}
            <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl ring-4 ring-gray-200 ring-offset-4 ring-offset-white">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transition-all duration-500"
                style={{
                  transform: 'scaleX(-1)',
                  opacity: isStreaming ? 1 : 0,
                }}
              />
              
              {/* Loading State */}
              <div
                className={`absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black transition-all duration-500 ${
                  isStreaming ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
                  <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">
                    Inicializando Cámara
                  </p>
                </div>
              </div>

              {/* Overlay effects */}
              <div className="absolute inset-0 rounded-full pointer-events-none">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 via-transparent to-black/30" />
              </div>

              {/* Status Indicator */}
              {(isDetecting || isSubmitting) && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl z-10">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-semibold">
                    {hasExistingBiometric ? 'Actualizando...' : 'Registrando...'}
                  </span>
                </div>
              )}

              {/* Guía de encuadre */}
              {isStreaming && !isDetecting && !isSubmitting && (
                <div className="absolute inset-0 rounded-full pointer-events-none">
                  <div className="absolute inset-8 border-2 border-white/20 rounded-full" />
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
                  <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCapture}
            disabled={!isStreaming || isSubmitting || isDetecting}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting || isDetecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {hasExistingBiometric ? 'Actualizando...' : 'Registrando...'}
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                {hasExistingBiometric ? 'Actualizar Captura' : 'Capturar Imagen'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
