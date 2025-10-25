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
            <h4 className="font-medium text-gray-900 mb-2">Bienvenido,</h4>
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
            <h4 className="font-medium text-gray-900 mb-2">Detalles del Check-in</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Hora:</span>{' '}
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
        case 'already_checked_in':
          return (
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        case 'already_checked_in':
          return {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            iconBg: 'bg-gray-100',
            text: 'text-gray-800'
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

        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 w-full max-w-sm">
          {result.detail && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Detalles:</h4>
              <p className="text-sm text-gray-700">{result.detail}</p>
            </div>
          )}
        </div>

        {/* Suggestions based on reason */}
        {result.reason === 'subscription_expired' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">Qué hacer:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Contacta a recepción para renovar tu suscripción</li>
              <li>• Verifica el estado de tu pago</li>
              <li>• Actualiza tu método de pago si es necesario</li>
            </ul>
          </div>
        )}

        {result.reason === 'inactive_client' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">Qué hacer:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Contacta a recepción para reactivar tu cuenta</li>
              <li>• Verifica el estado de tu cuenta</li>
              <li>• Actualiza tu información personal si es necesario</li>
            </ul>
          </div>
        )}

        {result.reason === 'no_active_subscription' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">Qué hacer:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Compra un nuevo plan de suscripción</li>
              <li>• Contacta a recepción para asistencia</li>
              <li>• Revisa las opciones de membresía disponibles</li>
            </ul>
          </div>
        )}

        {result.reason === 'already_checked_in' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-blue-800 mb-2">Información:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ya has registrado tu entrada hoy</li>
              <li>• Solo puedes hacer check-in una vez por día</li>
              <li>• Tu asistencia ya está registrada en el sistema</li>
              <li>• Puedes regresar mañana para tu próximo check-in</li>
            </ul>
          </div>
        )}

        {result.reason === 'face_not_recognized' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-blue-800 mb-2">Qué hacer:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Contacta a recepción para registrar tus datos faciales</li>
              <li>• Asegúrate de mirar directamente a la cámara</li>
              <li>• Intenta de nuevo con mejor iluminación</li>
              <li>• Asegúrate de que tu rostro esté claramente visible</li>
            </ul>
          </div>
        )}

        {result.reason === 'no_face_detected' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-orange-800 mb-2">Qué hacer:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Asegúrate de que tu rostro esté claramente visible en la cámara</li>
              <li>• Verifica que la cámara esté funcionando correctamente</li>
              <li>• Intenta ajustar la iluminación</li>
              <li>• Asegúrate de estar posicionado correctamente</li>
            </ul>
          </div>
        )}

        {result.reason === 'system_error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full max-w-sm mb-4">
            <h4 className="font-medium text-red-800 mb-2">Qué hacer:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {result.message.includes('conexión') ? (
                <>
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Asegúrate de que el servidor esté disponible</li>
                  <li>• Intenta de nuevo en unos momentos</li>
                  <li>• Contacta al soporte técnico si el problema persiste</li>
                </>
              ) : result.message.includes('tiempo') ? (
                <>
                  <li>• Verifica la velocidad de tu conexión a internet</li>
                  <li>• Intenta de nuevo con una conexión más estable</li>
                  <li>• Asegúrate de que no haya interferencias de red</li>
                  <li>• Contacta al soporte técnico si el problema persiste</li>
                </>
              ) : (
                <>
                  <li>• Intenta de nuevo en unos momentos</li>
                  <li>• Contacta al soporte técnico si el problema persiste</li>
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Reporta el problema a recepción</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
};
