// Camera utilities for facial recognition
export interface CameraConstraints {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    facingMode: 'user' | 'environment';
  };
}

export interface CameraState {
  stream: MediaStream | null;
  videoElement: HTMLVideoElement | null;
  isActive: boolean;
  error: string | null;
}

// Default camera constraints
export const DEFAULT_CAMERA_CONSTRAINTS: CameraConstraints = {
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: 'user',
  },
};

// Initialize camera
export const initializeCamera = async (
  videoElement: HTMLVideoElement,
  constraints: CameraConstraints = DEFAULT_CAMERA_CONSTRAINTS
): Promise<MediaStream> => {
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera access is not supported in this browser');
    }

    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Set video source
    videoElement.srcObject = stream;
    videoElement.play();
    
    return stream;
  } catch (error) {
    console.error('Camera initialization failed:', error);
    
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera access denied. Please allow camera permissions.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera is already in use by another application.');
      }
    }
    
    throw new Error('Failed to initialize camera. Please try again.');
  }
};

// Stop camera stream
export const stopCamera = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
};

// Check if camera is supported
export const isCameraSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// Get available cameras
export const getAvailableCameras = async (): Promise<MediaDeviceInfo[]> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Failed to get camera devices:', error);
    return [];
  }
};

// Switch camera (front/back)
export const switchCamera = async (
  videoElement: HTMLVideoElement,
  currentStream: MediaStream | null
): Promise<MediaStream> => {
  // Stop current stream
  if (currentStream) {
    stopCamera(currentStream);
  }

  // Get available cameras
  const cameras = await getAvailableCameras();
  if (cameras.length < 2) {
    throw new Error('No alternative camera found');
  }

  // Find the other camera
  const currentDeviceId = currentStream?.getVideoTracks()[0]?.getSettings().deviceId;
  const otherCamera = cameras.find(camera => camera.deviceId !== currentDeviceId);
  
  if (!otherCamera) {
    throw new Error('No alternative camera found');
  }

  // Initialize with the other camera
  const constraints: CameraConstraints = {
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      deviceId: { exact: otherCamera.deviceId },
    },
  };

  return initializeCamera(videoElement, constraints);
};
