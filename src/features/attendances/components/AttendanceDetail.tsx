import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { AttendanceWithClient } from '../types';

interface AttendanceDetailProps {
  attendance: AttendanceWithClient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AttendanceDetail: React.FC<AttendanceDetailProps> = ({
  attendance,
  isOpen,
  onClose,
}) => {
  if (!attendance) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    };
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const { date, time } = formatDateTime(attendance.check_in);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Attendance Details">
      <div className="space-y-6">
        {/* Client Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-xl">
              {getInitials(attendance.client_first_name, attendance.client_last_name)}
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">
                {attendance.client_first_name} {attendance.client_last_name}
              </h4>
              <p className="text-gray-600">DNI: {attendance.client_dni_number}</p>
              <p className="text-sm text-gray-500">Client ID: {attendance.client_id}</p>
            </div>
          </div>
        </Card>

        {/* Attendance Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attendance ID
              </label>
              <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                {attendance.id}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <p className="text-sm text-gray-900">{date}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Time
              </label>
              <p className="text-sm text-gray-900">{time}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
            </div>
          </div>
        </Card>

        {/* Meta Information */}
        {attendance.meta_info && Object.keys(attendance.meta_info).length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(attendance.meta_info, null, 2)}
              </pre>
            </div>
          </Card>
        )}

        {/* Raw Data */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Data</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(attendance, null, 2)}
            </pre>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              // Copy attendance ID to clipboard
              navigator.clipboard.writeText(attendance.id);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Copy ID
          </Button>
        </div>
      </div>
    </Modal>
  );
};
