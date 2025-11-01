import React from 'react';
import { CheckInResponse } from '../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  User,
  UserX,
  CreditCard,
  Camera,
  RefreshCw
} from 'lucide-react';

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

  // Get icon based on result reason
  const getIcon = () => {
    if (isSuccess) {
      return <CheckCircle2 className="w-12 h-12 text-green-600" />;
    }

    switch (result.reason) {
      case 'face_not_recognized':
        return <UserX className="w-12 h-12 text-blue-600" />;
      case 'no_face_detected':
        return <Camera className="w-12 h-12 text-orange-600" />;
      case 'subscription_expired':
      case 'no_active_subscription':
      case 'inactive_client':
        return <CreditCard className="w-12 h-12 text-yellow-600" />;
      case 'already_checked_in':
        return <Clock className="w-12 h-12 text-gray-600" />;
      default:
        return <XCircle className="w-12 h-12 text-red-600" />;
    }
  };

  // Get color scheme based on result
  const getColorScheme = () => {
    if (isSuccess) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        text: 'text-green-900',
        textLight: 'text-green-800',
        button: 'bg-green-600 hover:bg-green-700'
      };
    }

    switch (result.reason) {
      case 'face_not_recognized':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          text: 'text-blue-900',
          textLight: 'text-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'no_face_detected':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          iconBg: 'bg-orange-100',
          text: 'text-orange-900',
          textLight: 'text-orange-800',
          button: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'subscription_expired':
      case 'no_active_subscription':
      case 'inactive_client':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          text: 'text-yellow-900',
          textLight: 'text-yellow-800',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'already_checked_in':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
          text: 'text-gray-900',
          textLight: 'text-gray-800',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          text: 'text-red-900',
          textLight: 'text-red-800',
          button: 'bg-red-600 hover:bg-red-700'
        };
    }
  };

  const colors = getColorScheme();

  // Success View
  if (isSuccess) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Success Header */}
        <Card className={`p-4 ${colors.bg} border-2 ${colors.border} shadow-sm`}>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center shadow-md`}>
              {getIcon()}
            </div>

            <div>
              <h3 className={`text-xl font-bold ${colors.text} mb-1.5`}>
                {result.message}
              </h3>
              <div className="w-24 h-1 bg-green-200 rounded-full mx-auto">
                <div className="w-full h-full bg-green-600 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </Card>

        {/* Client Info - Compact */}
        {result.client_info && (
          <Card className="p-3 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-gray-600 mb-0.5">Cliente Identificado</h4>
                <p className="text-base font-bold text-gray-900 truncate">
                  {result.client_info.first_name} {result.client_info.last_name}
                </p>
                <p className="text-xs text-gray-600">
                  DNI: {result.client_info.dni_number}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Attendance Info - Compact */}
        {result.attendance && (
          <Card className="p-3 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-gray-600 mb-1.5">Detalles del Check-in</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium text-gray-900 text-right">
                      {new Date(result.attendance.check_in).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hora:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(result.attendance.check_in).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-mono text-xs text-gray-900">
                      {result.attendance.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Success Message - Compact */}
        <Card className="p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <p className="text-xs font-medium text-green-800 text-center">
            ✓ Tu entrada al gimnasio ha sido registrada exitosamente
          </p>
        </Card>
      </div>
    );
  }

  // Error/Denied View
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Error Header */}
      <Card className={`p-4 ${colors.bg} border-2 ${colors.border} shadow-sm`}>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center shadow-md`}>
            {getIcon()}
          </div>

          <div>
            <h3 className={`text-xl font-bold ${colors.text} mb-1.5`}>
              {result.message}
            </h3>
            {result.detail && (
              <p className={`text-xs ${colors.textLight} mt-1.5 max-w-md leading-relaxed`}>
                {result.detail}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Detailed Error Information */}
      <Card className="p-3 bg-white border border-gray-200 shadow-sm">
        <div className="space-y-3">
          {/* Action Suggestions */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-gray-600" />
              Qué puedes hacer:
            </h4>
            <ul className="space-y-1.5">
              {result.reason === 'subscription_expired' || result.reason === 'no_active_subscription' ? (
                <>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-yellow-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Contacta a recepción para renovar tu suscripción</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-yellow-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Verifica el estado de tu pago</span>
                  </li>
                </>
              ) : result.reason === 'inactive_client' ? (
                <>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-yellow-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Contacta a recepción para reactivar tu cuenta</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-yellow-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Verifica el estado de tu cuenta</span>
                  </li>
                </>
              ) : result.reason === 'already_checked_in' ? (
                <>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-gray-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Ya has registrado tu entrada hoy</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-gray-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Solo puedes hacer check-in una vez por día</span>
                  </li>
                </>
              ) : result.reason === 'face_not_recognized' ? (
                <>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-blue-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Contacta a recepción para registrar tus datos faciales</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-blue-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Asegúrate de mirar directamente a la cámara</span>
                  </li>
                </>
              ) : result.reason === 'no_face_detected' ? (
                <>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-orange-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Asegúrate de que tu rostro esté claramente visible</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-orange-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Verifica que la cámara esté funcionando</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-red-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Intenta de nuevo en unos momentos</span>
                  </li>
                  <li className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-red-600 mt-0.5 text-xs">•</span>
                    <span className="leading-relaxed">Contacta al soporte técnico si el problema persiste</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Retry Button */}
          {result.reason !== 'already_checked_in' && (
            <div className="pt-2 border-t border-gray-200">
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Intentar de Nuevo
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
