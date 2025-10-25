import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { useCamera } from '../../../hooks/useCamera';
import { formatImageForAPI } from '../utils/imageUtils';

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
    if (isProcessing) return;

    try {
      const base64 = await captureImage();
      const formattedImage = await formatImageForAPI(base64);
      
      setCapturedImage(formattedImage);
      onImageCaptured(formattedImage);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al procesar la imagen';
      onError(message);
    }
  };

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
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
                <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-600 rounded-full animate-spin" />
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
          {isProcessing && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-semibold">Procesando...</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleCapture}
          disabled={!isStreaming || isProcessing}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
              Procesando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Capturar
            </>
          )}
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        <p className="mb-2">
          {!capturedImage 
            ? "Posiciona tu rostro dentro del círculo y haz clic en 'Capturar'"
            : "Revisa tu foto y haz clic en 'Confirmar' para continuar"
          }
        </p>
        <p className="text-xs">
          Asegúrate de tener buena iluminación y que tu rostro sea claramente visible
        </p>
      </div>
    </div>
  );
};
