import React, { memo, useMemo } from 'react';
import { CheckInResponse } from '../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CheckCircle2, XCircle, AlertTriangle, Clock, User, RefreshCw, Phone, Camera } from 'lucide-react';
import { formatAttendanceDateTimeFull } from '../utils/dateUtils';
import { motion } from 'framer-motion';

interface CheckInResultProps {
  result: CheckInResponse;
  onRetry: () => void;
  onNewCheckIn?: () => void;
  className?: string;
}

export const CheckInResult: React.FC<CheckInResultProps> = memo(({
  result,
  onRetry,
  onNewCheckIn,
  className = '',
}) => {
  const isSuccess = result.success && result.can_enter;
  const isDenied = !result.success || !result.can_enter;

  // Reusable Action Button Component
  const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    delay?: number;
  }> = ({ onClick, icon, label, delay = 0.4 }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="w-full flex justify-center pt-6 border-t border-gray-100"
    >
      <Button
        onClick={onClick}
        variant="primary"
        size="lg"
        className="w-full sm:w-auto min-w-[240px] font-semibold shadow-md hover:shadow-lg px-8 py-4"
        leftIcon={icon}
      >
        {label}
      </Button>
    </motion.div>
  );

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
          icon: <User className="w-8 h-8" strokeWidth={2} />,
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
          icon: <AlertTriangle className="w-8 h-8" strokeWidth={2} />,
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
          icon: <XCircle className="w-8 h-8" strokeWidth={2} />,
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
          icon: <Clock className="w-8 h-8" strokeWidth={2} />,
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
          icon: <XCircle className="w-8 h-8" strokeWidth={2} />,
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
    // Mensajes motivadores según el número de asistencias
    const getMotivationalMessage = (count: number): string => {
      if (count === 1) return '¡Sigue así!';
      if (count <= 5) return '¡Excelente progreso!';
      if (count <= 10) return '¡Muy bien!';
      if (count <= 20) return '¡Gran dedicación!';
      return '¡Increíble constancia!';
    };

    return (
      <div className={`max-w-3xl mx-auto ${className}`}>
        {/* Main Success Card */}
        <Card className="p-8 sm:p-10 bg-white border border-gray-100 shadow-soft" padding="none">
          <div className="flex flex-col items-center space-y-8">
            {/* Success Icon */}
            <motion.div 
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl flex items-center justify-center shadow-[0_8px_16px_rgba(34,197,94,0.12),0_2px_4px_rgba(34,197,94,0.08)] border border-green-100/50">
                <CheckCircle2 className="w-12 h-12 text-green-600" strokeWidth={2} />
              </div>
            </motion.div>

            {/* Single Welcome Message */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {result.message}
              </h2>
            </motion.div>

            {/* Unified Information Section */}
            {(result.client_info || (result.attendance && dateTimeInfo)) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="w-full"
              >
                <Card className="p-6 bg-gray-50/50 border border-gray-100 shadow-sm" padding="none">
                  <div className="space-y-5">
                    {/* Client Info */}
                    {result.client_info && (
                      <div className="flex items-center gap-4 pb-5 border-b border-gray-200">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                          <User className="w-7 h-7 text-gray-700" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Cliente</p>
                          <p className="text-xl font-bold text-gray-900 truncate mb-1">
                            {result.client_info.first_name} {result.client_info.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            DNI: <span className="font-semibold text-gray-900">{result.client_info.dni_number}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Check-in Details */}
                    {result.attendance && dateTimeInfo && (
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                          <Clock className="w-7 h-7 text-gray-700" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Check-in</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="text-sm text-gray-600 mb-0.5">Fecha</p>
                              <p className="text-base font-bold text-gray-900 capitalize">{dateTimeInfo.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-0.5">Hora</p>
                              <p className="text-base font-bold text-gray-900">{dateTimeInfo.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Attendance Count Card - Prominent */}
            {result.total_attendances !== undefined && result.total_attendances !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: "spring" }}
                className="w-full"
              >
                <Card className="p-8 bg-gradient-to-br from-primary-50 via-primary-50/80 to-primary-100/50 border border-primary-100 shadow-sm" padding="none">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-3">Total de Asistencias</p>
                    <p className="text-5xl sm:text-6xl font-black text-primary-600 mb-3">
                      {result.total_attendances}
                    </p>
                    <p className="text-base font-semibold text-primary-700">
                      {getMotivationalMessage(result.total_attendances)}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Primary Action Button */}
            {onNewCheckIn && (
              <ActionButton
                onClick={onNewCheckIn}
                icon={<Camera className="w-5 h-5" strokeWidth={2} />}
                label="Registrar Otro Check-in"
                delay={0.45}
              />
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (isDenied && errorConfig) {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        <Card className="p-6 sm:p-8 bg-white border border-gray-100 shadow-soft" padding="none">
          <div className="flex flex-col items-center space-y-6 sm:space-y-7">
            {/* Error Icon - Neumorphic Style */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`w-20 h-20 sm:w-24 sm:h-24 ${errorConfig.iconBg} rounded-3xl flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] border border-gray-200/50`}
            >
              <div className={errorConfig.iconColor}>
                {errorConfig.icon}
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center space-y-2"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {result.message || errorConfig.title}
              </h2>
              {result.detail && (
                <p className="text-sm sm:text-base text-gray-600 font-medium max-w-md mx-auto">
                  {result.detail}
                </p>
              )}
            </motion.div>

            {/* Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="w-full"
            >
              <Card className="p-6 bg-gray-50/50 border border-gray-100 shadow-sm" padding="none">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
                  <Phone className="w-5 h-5 text-gray-600" strokeWidth={2} />
                  Qué puedes hacer:
                </h4>
                <ul className="space-y-2.5">
                  {errorConfig.actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-primary-500 mt-1 font-bold">•</span>
                      <span className="flex-1">{action}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Retry Button */}
            <ActionButton
              onClick={onRetry}
              icon={<RefreshCw className="w-5 h-5" strokeWidth={2} />}
              label="Intentar de Nuevo"
              delay={0.35}
            />
          </div>
        </Card>
      </div>
    );
  }

  return null;
});

CheckInResult.displayName = 'CheckInResult';
