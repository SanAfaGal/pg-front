import { useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '../../../../../components/ui/Badge';
import { formatAttendanceDateTime } from '../../../../attendances/utils/dateUtils';
import { isToday } from 'date-fns';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../../../../shared';

interface Attendance {
  id: string;
  check_in: string;
}

interface CompactAttendanceListProps {
  attendances: Attendance[];
  isLoading: boolean;
  error: Error | null;
  hasActiveFilters: boolean;
  totalCount: number;
  onClearFilters?: () => void;
}

/**
 * Compact Attendance List Component
 * Displays attendance history in a responsive format:
 * - Cards on mobile/tablet
 * - Table on desktop
 */
export const CompactAttendanceList = ({
  attendances,
  isLoading,
  error,
  hasActiveFilters,
  totalCount,
  onClearFilters,
}: CompactAttendanceListProps) => {
  const { isMobile, isTablet } = useMediaQuery();
  const isMobileOrTablet = isMobile || isTablet;

  const formattedAttendances = useMemo(() => {
    return attendances.map((att) => {
      const { date, time } = formatAttendanceDateTime(att.check_in);
      const attDate = new Date(att.check_in);
      const isTodayAttendance = isToday(attDate);
      const isRecent = new Date().getTime() - attDate.getTime() < 7 * 24 * 60 * 60 * 1000;

      return {
        ...att,
        date,
        time,
        isTodayAttendance,
        isRecent,
      };
    });
  }, [attendances]);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">Cargando asistencias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-red-600">Error al cargar asistencias</p>
      </div>
    );
  }

  if (!attendances || attendances.length === 0) {
    return (
      <div className="py-8 text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          {hasActiveFilters 
            ? 'No hay asistencias en el rango seleccionado' 
            : 'No hay asistencias registradas'
          }
        </p>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  // Mobile/Tablet Card View
  if (isMobileOrTablet) {
    return (
      <div className="space-y-3 p-3 sm:p-4">
        {formattedAttendances.map((attendance, index) => (
          <motion.div
            key={attendance.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {attendance.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 ml-8">
                  <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{attendance.time}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {(attendance.isTodayAttendance || attendance.isRecent) && (
                  <Badge 
                    variant={attendance.isTodayAttendance ? 'info' : 'success'} 
                    size="sm"
                  >
                    {attendance.isTodayAttendance ? 'Hoy' : 'Reciente'}
                  </Badge>
                )}
                <span className="text-xs text-gray-400 font-mono">
                  {attendance.id.slice(0, 6)}...
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Footer Info */}
        {hasActiveFilters && (
          <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 text-center">
            Mostrando {attendances.length} de {totalCount} asistencias
          </div>
        )}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="space-y-1">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 rounded-t-lg border-b border-gray-200 text-xs font-semibold text-gray-600">
        <div className="col-span-1">#</div>
        <div className="col-span-4">Fecha</div>
        <div className="col-span-3">Hora</div>
        <div className="col-span-2">Estado</div>
        <div className="col-span-2 text-right">ID</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {formattedAttendances.map((attendance, index) => (
          <motion.div
            key={attendance.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.01 }}
            className="grid grid-cols-12 gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors group"
          >
            <div className="col-span-1 text-xs text-gray-500 font-medium">
              {index + 1}
            </div>
            <div className="col-span-4 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm text-gray-900 font-medium">{attendance.date}</span>
            </div>
            <div className="col-span-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm text-gray-600">{attendance.time}</span>
            </div>
            <div className="col-span-2">
              {(attendance.isTodayAttendance || attendance.isRecent) && (
                <Badge 
                  variant={attendance.isTodayAttendance ? 'info' : 'success'} 
                  size="sm"
                >
                  {attendance.isTodayAttendance ? 'Hoy' : 'Reciente'}
                </Badge>
              )}
            </div>
            <div className="col-span-2 text-right">
              <span className="text-xs text-gray-400">
                {attendance.id.slice(0, 6)}...
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      {hasActiveFilters && (
        <div className="px-3 py-2 bg-gray-50 rounded-b-lg border-t border-gray-200 text-xs text-gray-600">
          Mostrando {attendances.length} de {totalCount} asistencias
        </div>
      )}
    </div>
  );
};

