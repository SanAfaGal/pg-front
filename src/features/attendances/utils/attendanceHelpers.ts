import { AttendanceWithClient } from '../types';

/**
 * Get initials from client name
 */
export const getAttendanceInitials = (firstName: string, lastName: string): string => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

/**
 * Check if attendance is recent (within last 24 hours)
 */
export const isRecentAttendance = (checkInDate: string): boolean => {
  const attendanceDate = new Date(checkInDate);
  const now = new Date();
  const hoursDiff = (now.getTime() - attendanceDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff <= 24;
};

/**
 * Get attendance status badge info
 */
export const getAttendanceStatus = (checkInDate: string): {
  label: string;
  variant: 'success' | 'default';
} => {
  const isRecent = isRecentAttendance(checkInDate);
  return {
    label: isRecent ? 'Reciente' : 'Completado',
    variant: isRecent ? 'success' : 'default',
  };
};

/**
 * Sort attendances by field
 */
export const sortAttendances = <T extends AttendanceWithClient>(
  attendances: T[],
  field: keyof T,
  direction: 'asc' | 'desc'
): T[] => {
  return [...attendances].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

