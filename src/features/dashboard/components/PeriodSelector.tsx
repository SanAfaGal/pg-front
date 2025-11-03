import { Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { PERIOD_OPTIONS, PERIOD_TYPES } from '../constants/dashboardConstants';
import { PeriodType } from '../types';
import { format } from 'date-fns';

interface PeriodSelectorProps {
  period: PeriodType;
  date: string; // YYYY-MM-DD format
  onPeriodChange: (period: PeriodType) => void;
  onDateChange: (date: string) => void;
}

export const PeriodSelector = ({
  period,
  date,
  onPeriodChange,
  onDateChange,
}: PeriodSelectorProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Period Buttons */}
      <div className="flex flex-wrap gap-2">
        {PERIOD_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={period === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onPeriodChange(option.value)}
            className="min-w-[100px]"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Date Input */}
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full sm:w-auto"
          size="sm"
        />
      </div>
    </div>
  );
};

