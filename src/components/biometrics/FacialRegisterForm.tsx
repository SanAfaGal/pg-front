import { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCamera } from '../../hooks/useCamera';
import { useToast } from '../../shared';
import { useRegisterFaceBiometric, useUpdateFaceBiometric, type BiometricData } from '../../features/clients';

interface FacialRegisterFormProps {
  clientId: string;
  clientName: string;
  biometric?: BiometricData;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FacialRegisterForm = ({
  clientId,
  onSuccess,
  onCancel,
  biometric,
}: FacialRegisterFormProps) => {
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
  } = useCamera();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleCapture = async () => {
    if (isSubmitting) return;

    try {
      setIsDetecting(true);
      const base64 = await captureImage();

      if (hasExistingBiometric) {
        await updateMutation.mutateAsync({ clientId, imageBase64: base64 });
      } else {
        await registerMutation.mutateAsync({ clientId, imageBase64: base64 });
      }

      stopCamera();
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al procesar la imagen';
      showToast({
        type: 'error',
        title: 'Error',
        message: message
      });
      setIsDetecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">Registro Facial</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-white hover:bg-red-800 p-1 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-center text-gray-600 text-sm leading-relaxed">
            {hasExistingBiometric
              ? 'Actualiza tu registro facial. Coloca el rostro frente a la cámara en buena iluminación.'
              : 'Completa tu registro facial. Coloca el rostro frente a la cámara en buena iluminación.'}
          </p>

          {/* Video Container - Mirror Circle */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80">
              {/* Video en forma de círculo con transición suave */}
              <div className="w-full h-full rounded-full overflow-hidden bg-black shadow-2xl border-4 border-gray-800 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transition-opacity duration-500"
                  style={{
                    transform: 'scaleX(-1)',
                    opacity: isStreaming ? 1 : 0,
                  }}
                />
                
                {/* Loading State - Superpuesto limpio */}
                <div
                  className={`absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black transition-all duration-500 ${
                    isStreaming ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin" />
                    <p className="text-gray-400 text-xs font-medium tracking-wide">INICIALIZANDO</p>
                  </div>
                </div>
              </div>

              {/* Efecto de espejo con brillo - superpuesto elegante */}
              <div className="absolute inset-0 rounded-full pointer-events-none">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 via-transparent to-black/30 shadow-inner" />
                <div className="absolute top-0 left-1/4 w-1/3 h-1/3 rounded-full bg-white/3 blur-3xl" />
              </div>

              {/* Marco circular elegante */}
              <div className="absolute -inset-2 rounded-full border-8 border-gray-400/10 pointer-events-none" />
              <div className="absolute -inset-1 rounded-full border-2 border-gray-500/20 pointer-events-none" />

              {/* Status Indicator */}
              {(isDetecting || isSubmitting) && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">Procesando...</span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 px-4 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleCapture}
              disabled={!isStreaming || isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                  Procesando...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2 inline-block" />
                  Capturar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};