import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { AttendanceFilterOptions } from '../types';

interface AttendanceFiltersProps {
  filters: AttendanceFilterOptions;
  onFiltersChange: (filters: AttendanceFilterOptions) => void;
  onClearFilters: () => void;
  className?: string;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = '',
}) => {
  const [localFilters, setLocalFilters] = useState<AttendanceFilterOptions>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof AttendanceFilterOptions, value: string) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name or DNI
            </label>
            <Input
              type="text"
              placeholder="Enter client name or DNI..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="datetime-local"
                value={localFilters.start_date ? localFilters.start_date.slice(0, 16) : ''}
                onChange={(e) => {
                  const value = e.target.value ? new Date(e.target.value).toISOString() : '';
                  handleFilterChange('start_date', value);
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="datetime-local"
                value={localFilters.end_date ? localFilters.end_date.slice(0, 16) : ''}
                onChange={(e) => {
                  const value = e.target.value ? new Date(e.target.value).toISOString() : '';
                  handleFilterChange('end_date', value);
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Quick Date Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  
                  setLocalFilters({
                    ...localFilters,
                    start_date: today.toISOString(),
                    end_date: tomorrow.toISOString(),
                  });
                }}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const weekStart = new Date();
                  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                  weekStart.setHours(0, 0, 0, 0);
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekEnd.getDate() + 7);
                  
                  setLocalFilters({
                    ...localFilters,
                    start_date: weekStart.toISOString(),
                    end_date: weekEnd.toISOString(),
                  });
                }}
              >
                This Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const monthStart = new Date();
                  monthStart.setDate(1);
                  monthStart.setHours(0, 0, 0, 0);
                  const monthEnd = new Date(monthStart);
                  monthEnd.setMonth(monthEnd.getMonth() + 1);
                  
                  setLocalFilters({
                    ...localFilters,
                    start_date: monthStart.toISOString(),
                    end_date: monthEnd.toISOString(),
                  });
                }}
              >
                This Month
              </Button>
            </div>
          </div>

          {/* Apply/Cancel Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setLocalFilters(filters)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: {filters.search}
                <button
                  onClick={() => onFiltersChange({ ...filters, search: undefined })}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.start_date && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                From: {new Date(filters.start_date).toLocaleDateString()}
                <button
                  onClick={() => onFiltersChange({ ...filters, start_date: undefined })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.end_date && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                To: {new Date(filters.end_date).toLocaleDateString()}
                <button
                  onClick={() => onFiltersChange({ ...filters, end_date: undefined })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
