import { Calendar, Clock } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { PERIOD_OPTIONS } from '../constants/dashboardConstants';
import { PeriodType } from '../types';
import { getPeriodLabelShort } from '../utils/periodHelpers';

interface PeriodSelectorProps {
  period: PeriodType;
  date: string; // YYYY-MM-DD format
  onPeriodChange: (period: PeriodType) => void;
  onDateChange: (date: string) => void;
  inline?: boolean; // Para mostrar inline en desktop
}

export const PeriodSelector = ({
  period,
  date,
  onPeriodChange,
  onDateChange,
  inline = false,
}: PeriodSelectorProps) => {
  if (inline) {
    // Versión inline para desktop - todo en una línea
    return (
      <div className="flex items-center gap-2">
        {/* Selector de Período - Inline */}
        <div className="flex items-center gap-1.5">
          {PERIOD_OPTIONS.map((option) => {
            const isActive = period === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onPeriodChange(option.value)}
                className={`
                  px-2 py-1 rounded-md font-semibold text-[10px] transition-all duration-200
                  transform hover:scale-105 active:scale-95 whitespace-nowrap
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md border border-indigo-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {getPeriodLabelShort(option.value)}
              </button>
            );
          })}
        </div>

        {/* Selector de Fecha - Inline */}
        <div className="relative">
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
            <Calendar className="w-3 h-3 text-gray-500" />
          </div>
          <Input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="pl-8 pr-2 py-1 bg-white border-gray-200 text-gray-700 focus:border-indigo-500 focus:bg-white text-[10px] h-7"
            size="sm"
          />
        </div>
      </div>
    );
  }

  // Versión normal para mobile
  return (
    <div className="space-y-2">
      {/* Selector de Período */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          Período
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PERIOD_OPTIONS.map((option) => {
            const isActive = period === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onPeriodChange(option.value)}
                className={`
                  px-2.5 py-1 rounded-lg font-semibold text-xs transition-all duration-200
                  transform hover:scale-105 active:scale-95
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/30 border-2 border-indigo-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">{getPeriodLabelShort(option.value)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de Fecha */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-500" />
          Fecha Referencia
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="pl-10 bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white hover:border-gray-300 transition-all duration-200 text-sm"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
