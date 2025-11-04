import { useMemo, useState, useCallback } from 'react';
import { Calendar, Activity, Clock, TrendingUp, ChevronLeft, ChevronRight, Gift, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { type ClientDashboardResponse } from '../../features/clients';
import { useClientAttendances } from '../../features/attendances/hooks/useAttendances';
import { formatAttendanceDateTime, formatAttendanceDate } from '../../features/attendances/utils/dateUtils';
import { useActiveSubscription } from '../../features/subscriptions';
import { useAvailableRewards, useCalculateRewardEligibility } from '../../features/rewards';
import { RewardBadge } from '../../features/rewards/components/RewardBadge';
import { canCalculateReward } from '../../features/rewards/utils/rewardHelpers';
import { useToast } from '../../shared';
import { NOTIFICATION_MESSAGES } from '../../features/rewards/constants/rewardConstants';

interface AttendanceTabProps {
  dashboard: ClientDashboardResponse | undefined;
}

/**
 * Attendance tab component for client detail view
 * Displays client attendance statistics and history
 */
export function AttendanceTab({ dashboard }: AttendanceTabProps) {
  const clientId = dashboard?.client.id;
  const [pagination, setPagination] = useState({ limit: 20, offset: 0 });
  const { showToast } = useToast();

  const { attendances, isLoading, error } = useClientAttendances(
    clientId || '',
    pagination
  );

  // Get active subscription for cycle calculation
  const { data: activeSubscription } = useActiveSubscription(clientId || '');
  
  // Get available rewards
  const { data: availableRewards } = useAvailableRewards(clientId);
  
  // Calculate eligibility mutation
  const calculateEligibilityMutation = useCalculateRewardEligibility();

  // Calculate cycle attendances (for reward eligibility)
  const cycleAttendances = useMemo(() => {
    if (!activeSubscription || !attendances || attendances.length === 0) return 0;
    
    const startDate = new Date(activeSubscription.start_date);
    const endDate = new Date(activeSubscription.end_date);
    
    return attendances.filter((att) => {
      const checkIn = new Date(att.check_in);
      return checkIn >= startDate && checkIn <= endDate;
    }).length;
  }, [attendances, activeSubscription]);

  // Check if can calculate reward (cycle ended and plan is monthly)
  const canCalculate = useMemo(() => {
    if (!activeSubscription) return false;
    
    // Check if plan is monthly (we need to get plan info, but for now check if duration is ~30 days)
    const durationDays = Math.ceil(
      (new Date(activeSubscription.end_date).getTime() - new Date(activeSubscription.start_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    const isMonthly = durationDays >= 28 && durationDays <= 31;
    
    return canCalculateReward(activeSubscription.end_date) && isMonthly;
  }, [activeSubscription]);

  // Calculate statistics from attendances
  const stats = useMemo(() => {
    if (!attendances || attendances.length === 0) {
      return {
        thisMonth: 0,
        monthlyAverage: 0,
        lastAttendance: null,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter attendances from current month
    const thisMonthAttendances = attendances.filter((att) => {
      const attDate = new Date(att.check_in);
      return (
        attDate.getMonth() === currentMonth &&
        attDate.getFullYear() === currentYear
      );
    });

    // Calculate monthly average (simplified - based on available data)
    // In a real scenario, you'd want to fetch more data or have it from the API
    const monthlyAverage = thisMonthAttendances.length;

    // Get last attendance
    const sortedByDate = [...attendances].sort(
      (a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime()
    );
    const lastAttendance = sortedByDate[0] || null;

    return {
      thisMonth: thisMonthAttendances.length,
      monthlyAverage,
      lastAttendance,
    };
  }, [attendances]);

  // Handle calculate reward eligibility
  const handleCalculateReward = useCallback(async () => {
    if (!activeSubscription) return;
    
    try {
      const result = await calculateEligibilityMutation.mutateAsync(activeSubscription.id);
      if (result.eligible) {
        showToast(NOTIFICATION_MESSAGES.reward.calculated, 'success');
      } else {
        showToast(`El cliente tiene ${result.attendance_count} asistencias. Se requieren 20 para obtener la recompensa.`, 'info');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || NOTIFICATION_MESSAGES.error.calculate;
      showToast(errorMessage, 'error');
    }
  }, [activeSubscription, calculateEligibilityMutation, showToast]);

  // Handle pagination
  const handlePreviousPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  }, []);

  const handleNextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  }, []);

  const canGoPrevious = pagination.offset > 0;
  const canGoNext = attendances.length >= pagination.limit;

  // Format last attendance date
  const lastAttendanceDate = useMemo(() => {
    if (stats.lastAttendance) {
      return formatAttendanceDate(stats.lastAttendance.check_in);
    }
    return null;
  }, [stats.lastAttendance]);

  return (
    <div className="space-y-6">
      {/* Reward Section */}
      {activeSubscription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-900">Sistema de Recompensas</h3>
                  <p className="text-sm text-purple-700">Obtén 20% de descuento con 20+ asistencias</p>
                </div>
              </div>
              {availableRewards && availableRewards.length > 0 && (
                <RewardBadge reward={availableRewards[0]} />
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Asistencias del ciclo actual:
                  </span>
                </div>
                <Badge variant={cycleAttendances >= 20 ? 'success' : 'info'} size="lg">
                  {cycleAttendances}/20
                </Badge>
              </div>

              {cycleAttendances >= 20 && canCalculate && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900">
                      ¡Elegible para recompensa!
                    </p>
                    <p className="text-xs text-green-700">
                      El ciclo ha terminado y cumples con el umbral de asistencias.
                    </p>
                  </div>
                  <Button
                    onClick={handleCalculateReward}
                    disabled={calculateEligibilityMutation.isPending}
                    variant="primary"
                    size="sm"
                  >
                    {calculateEligibilityMutation.isPending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Calculando...</span>
                      </>
                    ) : (
                      'Calcular Recompensa'
                    )}
                  </Button>
                </div>
              )}

              {cycleAttendances < 20 && activeSubscription && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Progreso:</span> Te faltan{' '}
                    <span className="font-bold">{20 - cycleAttendances}</span> asistencias para
                    obtener la recompensa del 20% de descuento.
                  </p>
                </div>
              )}

              {availableRewards && availableRewards.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-1">
                    Recompensas disponibles
                  </p>
                  <RewardBadge 
                    reward={availableRewards[0]}
                    attendanceCount={cycleAttendances}
                    subscriptionEndDate={activeSubscription?.end_date}
                  />
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 border-2 border-blue-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
              {stats.thisMonth > 0 && (
                <TrendingUp className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <p className="text-4xl font-bold text-blue-700 mb-2">
              {stats.thisMonth}
            </p>
            <p className="text-sm font-semibold text-blue-600">
              Asistencias este mes
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 border-2 border-green-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              {stats.monthlyAverage > 0 && (
                <TrendingUp className="w-5 h-5 text-green-500" />
              )}
            </div>
            <p className="text-4xl font-bold text-green-700 mb-2">
              {stats.monthlyAverage}
            </p>
            <p className="text-sm font-semibold text-green-600">
              Promedio mensual
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50 border-2 border-amber-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-700 mb-2">
              {lastAttendanceDate || 'N/A'}
            </p>
            <p className="text-sm font-semibold text-amber-600">
              Última asistencia
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Attendance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="p-6 shadow-lg border-2 border-gray-200">
          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" text="Cargando asistencias..." />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Error al cargar asistencias
              </h3>
              <p className="text-sm text-red-700">
                No se pudieron cargar las asistencias. Por favor, intenta nuevamente.
              </p>
            </div>
          ) : !attendances || attendances.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay asistencias registradas
              </h3>
              <p className="text-sm text-gray-500">
                Este cliente aún no tiene registros de asistencia.
              </p>
            </div>
          ) : (
            <>
              {/* Attendance List */}
              <div className="space-y-3">
                {attendances.map((attendance, index) => {
                  const { date, time } = formatAttendanceDateTime(attendance.check_in);
                  const attDate = new Date(attendance.check_in);
                  const isToday = new Date().toDateString() === attDate.toDateString();
                  const isRecent = new Date().getTime() - attDate.getTime() < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <motion.div
                      key={attendance.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isToday 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' 
                              : isRecent
                              ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-md'
                              : 'bg-gradient-to-br from-gray-400 to-gray-500'
                          }`}>
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-base font-semibold text-gray-900">
                                {date}
                              </p>
                              {(isToday || isRecent) && (
                                <Badge 
                                  variant={isToday ? 'info' : 'success'} 
                                  size="sm"
                                >
                                  {isToday ? 'Hoy' : 'Reciente'}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-medium">
                              ID
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              {attendance.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {(canGoPrevious || canGoNext) && (
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Mostrando <span className="font-semibold text-gray-900">
                      {pagination.offset + 1}
                    </span> a{' '}
                    <span className="font-semibold text-gray-900">
                      {Math.min(pagination.offset + pagination.limit, pagination.offset + attendances.length)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!canGoPrevious}
                      leftIcon={<ChevronLeft className="w-4 h-4" />}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!canGoNext}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
