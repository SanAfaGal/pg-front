import React from 'react';
import { CheckInResponse } from '../types';

interface CheckInResultProps {
  result: CheckInResponse;
  onRetry: () => void;
  className?: string;
}

export const CheckInResult: React.FC<CheckInResultProps> = ({
  result,
  onRetry,
  className = '',
}) => {
  const isSuccess = result.success && result.can_enter;
  const isDenied = !result.success || !result.can_enter;

  if (isSuccess) {
    return (
      <div className={`flex flex-col items-center p-6 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          {result.message}
        </h3>

        {/* Client Info */}
        {result.client_info && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 w-full max-w-sm">
            <h4 className="font-medium text-gray-900 mb-2">Welcome,</h4>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">
                {result.client_info.first_name} {result.client_info.last_name}
              </p>
              <p className="text-sm text-gray-600">
                DNI: {result.client_info.dni_number}
              </p>
            </div>
          </div>
        )}

        {/* Attendance Info */}
        {result.attendance && (
          <div className="bg-white p-4 rounded-lg shadow-sm w-full max-w-sm">
            <h4 className="font-medium text-gray-900 mb-2">Check-in Details</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Time:</span>{' '}
                {new Date(result.attendance.check_in).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">ID:</span> {result.attendance.id}
              </p>
            </div>
          </div>
        )}

        {/* Success Animation */}
        <div className="mt-4 text-green-600">
          <div className="animate-pulse">
            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (isDenied) {
    // Get appropriate icon and colors based on error type
    const getErrorIcon = () => {
      switch (result.reason) {
        case 'face_not_recognized':
          return (
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
          );
        case 'no_face_detected':
          return (
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
          );
        case 'subscription_expired':
        case 'no_active_subscription':
        case 'inactive_client':
          return (
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        default:
          return (
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          );
      }
    };

    const getErrorColors = () => {
      switch (result.reason) {
        case 'face_not_recognized':
          return {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            iconBg: 'bg-blue-100',
            text: 'text-blue-800'
          };
        case 'no_face_detected':
          return {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            iconBg: 'bg-orange-100',
            text: 'text-orange-800'
          };
        case 'subscription_expired':
        case 'no_active_subscription':
        case 'inactive_client':
          return {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            iconBg: 'bg-yellow-100',
            text: 'text-yellow-800'
          };
        default:
          return {
            bg: 'bg-red-50',
            border: 'border-red-200',
            iconBg: 'bg-red-100',
            text: 'text-red-800'
          };
      }
    };

    const colors = getErrorColors();

    return (
      <div className={`flex flex-col items-center p-6 ${colors.bg} border ${colors.border} rounded-lg ${className}`}>
        {/* Denied Icon */}
        <div className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center mb-4`}>
          {getErrorIcon()}
        </div>

        {/* Denied Message */}
        <h3 className={`text-xl font-semibold ${colors.text} mb-2`}>
          {result.message}
        </h3>

        {/* Reason and Detail */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 w-full max-w-sm">
          {result.reason && (
            <div className="mb-3">
              <h4 className="font-medium text-gray-900 mb-1">Reason:</h4>
              <p className="text-sm text-gray-700 capitalize">
                {result.reason.replace('_', ' ')}
              </p>
            </div>
          )}
          
          {result.detail && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Details:</h4>
              <p className="text-sm text-gray-700">{result.detail}</p>
            </div>
          )}
        </div>

        {/* Suggestions based on reason */}
        {result.reason === 'subscription_expired' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">What to do:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Contact the front desk to renew your subscription</li>
              <li>• Check your payment status</li>
              <li>• Update your payment method if needed</li>
            </ul>
          </div>
        )}

        {result.reason === 'inactive_client' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">What to do:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Contact the front desk to reactivate your account</li>
              <li>• Verify your account status</li>
              <li>• Update your personal information if needed</li>
            </ul>
          </div>
        )}

        {result.reason === 'no_active_subscription' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">What to do:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Purchase a new subscription plan</li>
              <li>• Contact the front desk for assistance</li>
              <li>• Check available membership options</li>
            </ul>
          </div>
        )}

        {result.reason === 'face_not_recognized' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-blue-800 mb-2">What to do:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Contact the front desk to register your facial data</li>
              <li>• Ensure you're looking directly at the camera</li>
              <li>• Try again with better lighting</li>
              <li>• Make sure your face is clearly visible</li>
            </ul>
          </div>
        )}

        {result.reason === 'no_face_detected' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-orange-800 mb-2">What to do:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Ensure your face is clearly visible in the camera</li>
              <li>• Check that the camera is working properly</li>
              <li>• Try adjusting the lighting</li>
              <li>• Make sure you're positioned correctly</li>
            </ul>
          </div>
        )}

        {result.reason === 'system_error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-red-800 mb-2">What to do:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Try again in a few moments</li>
              <li>• Contact technical support if the problem persists</li>
              <li>• Check your internet connection</li>
              <li>• Report the issue to the front desk</li>
            </ul>
          </div>
        )}

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
};
