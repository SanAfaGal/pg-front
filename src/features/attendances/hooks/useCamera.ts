import { useState, useRef, useEffect, useCallback } from 'react';

interface UseCameraOptions {
  onError?: (error: Error) => void;
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  hasPermission: boolean | null;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => Promise<string>;
  requestPermission: () => Promise<boolean>;
}

export const useCamera = (options: UseCameraOptions = {}): UseCameraReturn => {
  const {
    onError,
    facingMode = 'user',
    width = 640,
    height = 480,
  } = options;

  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      setError(null);
      return true;
    } catch (err) {
      const error = err as Error;
      setHasPermission(false);

      let errorMessage = 'No se pudo acceder a la cámara';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Permiso de cámara denegado. Por favor, habilite el acceso en la configuración de su navegador.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No se encontró ninguna cámara en este dispositivo.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'La cámara está siendo utilizada por otra aplicación.';
      }

      setError(errorMessage);
      onError?.(new Error(errorMessage));
      return false;
    }
  }, [onError]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Su navegador no soporta acceso a la cámara');
      }

      if (!videoRef.current) {
        throw new Error('Elemento de video no disponible');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: width },
          height: { ideal: height },
        },
        audio: false,
      });

      // Asignar stream al video (compatible con navegadores antiguos)
      if ('srcObject' in videoRef.current) {
        videoRef.current.srcObject = stream;
      } else {
        // Para navegadores más antiguos
        (videoRef.current as HTMLVideoElement & { src?: string }).src = URL.createObjectURL(stream);
      }

      streamRef.current = stream;

      // Esperar a que el video tenga datos
      return new Promise<void>((resolve, reject) => {
        const video = videoRef.current;
        if (!video) {
          reject(new Error('Video element lost'));
          return;
        }

        let resolved = false;

        const checkVideoReady = () => {
          // Verificar que el video tenga dimensiones y está jugando
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            if (!resolved) {
              resolved = true;
              clearInterval(intervalId);
              clearTimeout(timeoutId);
              video.removeEventListener('loadedmetadata', handleLoadedMetadata);
              video.removeEventListener('error', handleError);
              setIsStreaming(true);
              setHasPermission(true);
              resolve();
            }
          }
        };

        const handleLoadedMetadata = () => {
          checkVideoReady();
        };

        const handleError = () => {
          if (!resolved) {
            resolved = true;
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('error', handleError);
            reject(new Error('Video error'));
          }
        };

        const timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            clearInterval(intervalId);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('error', handleError);
            setIsStreaming(true);
            setHasPermission(true);
            resolve();
          }
        }, 3000);

        const intervalId = setInterval(checkVideoReady, 100);

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);

        // Reproducir el video
        try {
          video.play().catch(() => {
            // Auto-play bloqueado, pero continuamos
          });
        } catch {
          // Ignorar errores de auto-play
        }
      });
    } catch (err) {
      const error = err as Error;

      let errorMessage = 'Error al iniciar la cámara';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Permiso de cámara denegado';
        setHasPermission(false);
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No se encontró cámara';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Cámara en uso por otra aplicación';
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setIsStreaming(false);
      onError?.(new Error(errorMessage));
      stopCamera();
    }
  }, [facingMode, width, height, onError, stopCamera]);

  const captureImage = useCallback(async (): Promise<string> => {
    if (!videoRef.current || !isStreaming) {
      throw new Error('La cámara no está activa');
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }

    ctx.drawImage(videoRef.current, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64 = dataUrl.split(',')[1];

    if (!base64) {
      throw new Error('Error al capturar la imagen');
    }

    return base64;
  }, [isStreaming]);

  return {
    videoRef,
    isStreaming,
    hasPermission,
    error,
    startCamera,
    stopCamera,
    captureImage,
    requestPermission,
  };
};


