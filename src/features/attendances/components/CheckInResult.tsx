import React, { memo, useMemo } from 'react';
import { CheckInResponse } from '../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CheckCircle2, XCircle, AlertTriangle, Clock, User, Calendar, RefreshCw, Phone } from 'lucide-react';
import { formatAttendanceDateTimeFull } from '../utils/dateUtils';

interface CheckInResultProps {
  result: CheckInResponse;
  onRetry: () => void;
  className?: string;
}

export const CheckInResult: React.FC<CheckInResultProps> = memo(({
  result,
  onRetry,
  className = '',
}) => {
  const isSuccess = result.success && result.can_enter;
  const isDenied = !result.success || !result.can_enter;

  const dateTimeInfo = useMemo(() => {
    if (result.attendance?.check_in) {
      return formatAttendanceDateTimeFull(result.attendance.check_in);
    }
    return null;
  }, [result.attendance]);

  // Get error configuration (moved before conditional returns)
  const errorConfig = useMemo(() => {
    if (!isDenied) return null;
    
    switch (result.reason) {
      case 'face_not_recognized':
        return {
          icon: <User className="w-8 h-8" />,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          text: 'text-blue-900',
          title: 'Rostro no reconocido',
          actions: [
            'Contacta a recepción para registrar tus datos faciales',
            'Asegúrate de mirar directamente a la cámara',
            'Intenta de nuevo con mejor iluminación',
            'Verifica que tu rostro esté claramente visible',
          ],
        };
      case 'no_face_detected':
        return {
          icon: <AlertTriangle className="w-8 h-8" />,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          text: 'text-orange-900',
          title: 'No se detectó rostro',
          actions: [
            'Asegúrate de que tu rostro esté claramente visible',
            'Verifica que la cámara esté funcionando',
            'Intenta ajustar la iluminación',
            'Asegúrate de estar posicionado correctamente',
          ],
        };
      case 'subscription_expired':
      case 'no_active_subscription':
      case 'inactive_client':
        return {
          icon: <XCircle className="w-8 h-8" />,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-900',
          title: 'Acceso restringido',
          actions: result.reason === 'subscription_expired' ? [
            'Contacta a recepción para renovar tu suscripción',
            'Verifica el estado de tu pago',
            'Actualiza tu método de pago si es necesario',
          ] : result.reason === 'no_active_subscription' ? [
            'Compra un nuevo plan de suscripción',
            'Contacta a recepción para asistencia',
            'Revisa las opciones de membresía disponibles',
          ] : [
            'Contacta a recepción para reactivar tu cuenta',
            'Verifica el estado de tu cuenta',
            'Actualiza tu información personal si es necesario',
          ],
        };
      case 'already_checked_in':
        return {
          icon: <Clock className="w-8 h-8" />,
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          text: 'text-gray-900',
          title: 'Ya has hecho check-in hoy',
          actions: [
            'Ya has registrado tu entrada hoy',
            'Solo puedes hacer check-in una vez por día',
            'Tu asistencia ya está registrada en el sistema',
            'Puedes regresar mañana para tu próximo check-in',
          ],
        };
      default:
        return {
          icon: <XCircle className="w-8 h-8" />,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-900',
          title: 'Error del sistema',
          actions: result.message.includes('conexión') ? [
            'Verifica tu conexión a internet',
            'Asegúrate de que el servidor esté disponible',
            'Intenta de nuevo en unos momentos',
            'Contacta al soporte técnico si el problema persiste',
          ] : result.message.includes('tiempo') ? [
            'Verifica la velocidad de tu conexión',
            'Intenta con una conexión más estable',
            'Asegúrate de que no haya interferencias',
            'Contacta al soporte técnico si persiste',
          ] : [
            'Intenta de nuevo en unos momentos',
            'Contacta al soporte técnico',
            'Verifica tu conexión a internet',
            'Reporta el problema a recepción',
          ],
        };
    }
  }, [result.reason, result.message, isDenied]);

  if (isSuccess) {
    return (
      <Card className={`p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg ${className}`}>
        <div className="flex flex-col items-center space-y-6">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg ring-4 ring-green-200 ring-opacity-50">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-green-900">
              {result.message}
            </h3>
            <p className="text-green-700 font-medium">¡Bienvenido al gimnasio!</p>
          </div>

          {/* Client Info Card */}
          {result.client_info && (
            <Card className="w-full p-4 bg-white border-green-200 shadow-sm max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Información del Cliente</h4>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      {result.client_info.first_name} {result.client_info.last_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      DNI: <span className="font-medium">{result.client_info.dni_number}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Attendance Details Card */}
          {result.attendance && dateTimeInfo && (
            <Card className="w-full p-4 bg-white border-green-200 shadow-sm max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Detalles del Check-in
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fecha:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">{dateTimeInfo.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hora:</span>
                      <span className="text-sm font-medium text-gray-900">{dateTimeInfo.time}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">ID de Registro:</span>
                        <span className="text-xs text-gray-700">{result.attendance.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Success Footer */}
          <div className="w-full bg-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 text-center font-medium">
              ✓ Tu entrada ha sido registrada exitosamente. ¡Disfruta tu entrenamiento!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (isDenied && errorConfig) {
    return (
      <Card className={`p-6 bg-gradient-to-br ${errorConfig.bg} border-2 ${errorConfig.border} shadow-lg ${className}`}>
        <div className="flex flex-col items-center space-y-6">
          {/* Error Icon */}
          <div className={`w-20 h-20 ${errorConfig.iconBg} rounded-full flex items-center justify-center shadow-lg ${errorConfig.iconColor}`}>
            {errorConfig.icon}
          </div>

          {/* Error Message */}
          <div className="text-center space-y-2">
            <h3 className={`text-2xl font-bold ${errorConfig.text}`}>
              {result.message || errorConfig.title}
            </h3>
            {result.detail && (
              <p className={`text-sm ${errorConfig.text} opacity-80`}>
                {result.detail}
              </p>
            )}
          </div>

          {/* Actions Card */}
          <Card className={`w-full p-4 bg-white border ${errorConfig.border} shadow-sm max-w-2xl mx-auto`}>
            <h4 className={`font-semibold ${errorConfig.text} mb-3 flex items-center gap-2`}>
              <Phone className="w-4 h-4" />
              Qué puedes hacer:
            </h4>
            <ul className="space-y-2">
              {errorConfig.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className={`${errorConfig.iconColor} mt-1`}>•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Retry Button */}
          <Button
            onClick={onRetry}
            variant="outline"
            className={`border-2 ${errorConfig.border} ${errorConfig.text} hover:bg-white hover:${errorConfig.bg}`}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Intentar de Nuevo
          </Button>
        </div>
      </Card>
    );
  }

  return null;
});

CheckInResult.displayName = 'CheckInResult';
