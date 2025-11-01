import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useCamera } from '../../../hooks/useCamera';
import { formatImageForAPI } from '../utils/imageUtils';
import { Camera, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface CameraCaptureProps {
  onImageCaptured: (base64Image: string) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
  className?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onImageCaptured,
  onError,
  isProcessing = false,
  className = '',
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(true);
  const [hasCaptured, setHasCaptured] = useState(false);

  const {
    videoRef,
    isStreaming,
    startCamera,
    stopCamera,
    captureImage,
    error: cameraError,
  } = useCamera();

  useEffect(() => {
    if (showCamera && !hasCaptured) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCamera, hasCaptured]);

  const handleCapture = async () => {
    if (isProcessing || !isStreaming) return;

    try {
      const base64 = await captureImage();
      const formattedImage = await formatImageForAPI(base64);
      
      setCapturedImage(formattedImage);
      setHasCaptured(true);
      setShowCamera(false); // Hide camera immediately after capture
      onImageCaptured(formattedImage);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al procesar la imagen';
      onError(message);
      setShowCamera(true); // Show camera again on error
      setHasCaptured(false);
    }
  };

  const handleRetry = useCallback(() => {
    setCapturedImage(null);
    setHasCaptured(false);
    setShowCamera(true);
  }, []);

  // Error handling for camera
  if (cameraError) {
    return (
      <Card className="p-8 bg-red-50 border-red-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Error al acceder a la cámara</h3>
            <p className="text-sm text-red-700 mb-4">
              {cameraError.message || 'No se pudo acceder a la cámara. Por favor, verifica los permisos.'}
            </p>
            <Button onClick={handleRetry} variant="outline">
              Reintentar
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Camera Section - Only show when not captured */}
      {showCamera && !hasCaptured ? (
        <>
          {/* Video Container - Mirror Circle */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              {/* Video en forma de círculo con transición suave */}
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl ring-4 ring-gray-200 ring-offset-4 ring-offset-white flex items-center justify-center">
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
                
                {/* Loading State */}
                <div
                  className={`absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black transition-all duration-500 ${
                    isStreaming ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                    <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">
                      Inicializando Cámara
                    </p>
                  </div>
                </div>

                {/* Overlay effects */}
                <div className="absolute inset-0 rounded-full pointer-events-none">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 via-transparent to-black/30" />
                </div>

                {/* Status Indicator */}
                {isProcessing && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl z-10">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-semibold">Procesando...</span>
                  </div>
                )}

                {/* Guía de encuadre */}
                {isStreaming && !isProcessing && (
                  <div className="absolute inset-0 rounded-full pointer-events-none">
                    <div className="absolute inset-8 border-2 border-white/20 rounded-full" />
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
                    <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Capture Button */}
          <div className="w-full max-w-md">
            <Button
              onClick={handleCapture}
              disabled={!isStreaming || isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed py-3"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Capturar Foto
                </>
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center text-xs text-gray-600 max-w-md">
            <p className="font-medium mb-0.5">
              Posiciona tu rostro dentro del círculo
            </p>
            <p className="text-xs leading-relaxed">
              Buena iluminación y rostro claramente visible
            </p>
          </div>
        </>
      ) : hasCaptured ? (
        /* Success Message After Capture */
        <Card className="p-3 bg-green-50 border-green-200 w-full max-w-md">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-900 mb-1">Foto Capturada</h3>
              <p className="text-xs text-green-800 mb-2 leading-relaxed">
                Procesando check-in automáticamente...
              </p>
              <p className="text-xs text-green-700 font-medium mb-2">
                ✓ No es necesario permanecer frente a la cámara
              </p>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-100 text-xs py-1"
              >
                Capturar de Nuevo
              </Button>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
};
