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
      
      // Handle different types of errors based on HTTP status codes
      let errorResult: CheckInResponse;
      
      // Check if it's a network error or API error
      if (err?.message?.includes('HTTP error! status:')) {
        const statusMatch = err.message.match(/HTTP error! status: (\d+)/);
        const status = statusMatch ? parseInt(statusMatch[1]) : 500;
        
        if (status === 400) {
          // No face detected
          errorResult = {
            success: false,
            message: 'No face detected in the image',
            can_enter: false,
            reason: 'no_face_detected',
            detail: 'Please ensure your face is clearly visible in the camera frame and try again.',
          };
        } else if (status === 401) {
          // Face not recognized
          errorResult = {
            success: false,
            message: 'Face not recognized',
            can_enter: false,
            reason: 'face_not_recognized',
            detail: 'Your face was not recognized in our system. Please contact the front desk to register your facial data.',
          };
        } else if (status === 403) {
          // Access denied - use the response data if available
          errorResult = {
            success: false,
            message: 'Access denied',
            can_enter: false,
            reason: 'subscription_expired',
            detail: 'Access to the gym is currently restricted. Please check your subscription status.',
          };
        } else {
          // Generic system error
          errorResult = {
            success: false,
            message: 'System error occurred',
            can_enter: false,
            reason: 'system_error',
            detail: 'An unexpected error occurred. Please try again.',
          };
        }
      } else {
        // Network or other errors
        errorResult = {
          success: false,
          message: 'Connection error',
          can_enter: false,
          reason: 'system_error',
          detail: 'Unable to connect to the server. Please check your internet connection and try again.',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Facial Check-in</h1>
        <p className="text-gray-600">
          Use facial recognition to check in to the gym. Position your face within the camera view and click capture.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Camera Capture</h2>
          <CameraCapture
            onImageCaptured={handleImageCaptured}
            onError={handleError}
            isProcessing={isProcessing || isLoading}
          />
        </Card>

        {/* Result Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Check-in Result</h2>
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
                <p className="text-lg font-medium">Ready for Check-in</p>
                <p className="text-sm">Capture your photo to begin the check-in process</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">1. Position Your Face</h4>
            <p className="text-sm text-gray-600">
              Make sure your face is clearly visible within the camera frame and well-lit.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">2. Capture Photo</h4>
            <p className="text-sm text-gray-600">
              Click the "Capture" button to take your photo for facial recognition.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">3. Get Confirmation</h4>
            <p className="text-sm text-gray-600">
              Wait for the system to process your photo and confirm your access.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
