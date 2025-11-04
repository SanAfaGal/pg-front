import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useCamera } from '../hooks/useCamera';
import { formatImageForAPI } from '../utils/imageUtils';
import { Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraCaptureProps {
  onImageCaptured: (base64Image: string) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
  className?: string;
}

/**
 * Camera capture component for facial recognition check-in
 * Handles camera initialization, image capture, and visual feedback
 */
export const CameraCapture: React.FC<CameraCaptureProps> = memo(({
  onImageCaptured,
  onError,
  isProcessing = false,
  className = '',
}) => {
  const [hasCaptured, setHasCaptured] = useState(false);
  
  const {
    videoRef,
    isStreaming,
    startCamera,
    stopCamera,
    captureImage,
    error: cameraError,
  } = useCamera();

  // Manage camera lifecycle based on capture state
  useEffect(() => {
    if (!hasCaptured) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [hasCaptured, startCamera, stopCamera]);

  /**
   * Handles image capture and formatting
   */
  const handleCapture = useCallback(async () => {
    if (isProcessing || !isStreaming) return;

    try {
      const base64 = await captureImage();
      const formattedImage = await formatImageForAPI(base64);
      
      setHasCaptured(true);
      onImageCaptured(formattedImage);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al procesar la imagen';
      onError(message);
      setHasCaptured(false);
    }
  }, [isProcessing, isStreaming, captureImage, onImageCaptured, onError]);

  /**
   * Resets capture state to allow new photo
   */
  const handleRetry = useCallback(() => {
    setHasCaptured(false);
  }, []);

  // Memoize capture button state
  const canCapture = useMemo(() => isStreaming && !isProcessing, [isStreaming, isProcessing]);

  // Error state component
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
              {cameraError || 'No se pudo acceder a la cámara. Por favor, verifica los permisos.'}
            </p>
            <Button onClick={handleRetry} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              Reintentar
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      <AnimatePresence mode="wait">
        {!hasCaptured ? (
          <motion.div
            key="camera-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-6"
          >
            {/* Video Container - Circular Frame */}
            <div className="flex justify-center">
              <div className="relative w-80 h-80">
                {/* Circular video frame with elegant styling */}
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl ring-4 ring-gray-200 ring-offset-4 ring-offset-white flex items-center justify-center">
                  {/* Video element with mirror effect */}
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
                  
                  {/* Loading overlay */}
                  <AnimatePresence>
                    {!isStreaming && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <LoadingSpinner size="lg" />
                          <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">
                            Inicializando Cámara
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Processing indicator */}
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl z-10"
                    >
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-semibold">Procesando...</span>
                    </motion.div>
                  )}

                  {/* Frame guides - only show when streaming */}
                  {isStreaming && !isProcessing && (
                    <div className="absolute inset-0 rounded-full pointer-events-none">
                      {/* Outer circle guide */}
                      <div className="absolute inset-8 border-2 border-white/20 rounded-full" />
                      {/* Top guide */}
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
                      {/* Bottom guide */}
                      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
                    </div>
                  )}

                  {/* Subtle overlay effects */}
                  <div className="absolute inset-0 rounded-full pointer-events-none">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 via-transparent to-black/30" />
                  </div>
                </div>
              </div>
            </div>

            {/* Capture Button */}
            <div className="w-full">
              <Button
                onClick={handleCapture}
                disabled={!canCapture}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
                isLoading={isProcessing}
                leftIcon={!isProcessing ? <Camera className="w-5 h-5" /> : undefined}
              >
                {isProcessing ? 'Procesando...' : 'Capturar Foto'}
              </Button>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 w-full">
              <p className="font-medium mb-1">
                Posiciona tu rostro dentro del círculo
              </p>
              <p className="text-xs">
                Asegúrate de tener buena iluminación y que tu rostro sea claramente visible
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Success Message After Capture */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex flex-col items-center text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Foto Capturada</h3>
                  <p className="text-sm text-green-800 mb-4">
                    Tu foto ha sido capturada exitosamente. El sistema está procesando tu check-in.
                  </p>
                  <p className="text-xs text-green-700 font-medium mb-4 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Ya no es necesario permanecer frente a la cámara
                  </p>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    Capturar de Nuevo
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CameraCapture.displayName = 'CameraCapture';
