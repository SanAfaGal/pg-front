/**
 * Tests for attendance helper functions
 */
import { describe, it, expect } from 'vitest';
import {
  getAttendanceInitials,
  isRecentAttendance,
  getAttendanceStatus,
  sortAttendances,
} from './attendanceHelpers';
import { AttendanceWithClient } from '../types';

describe('attendanceHelpers', () => {
  describe('getAttendanceInitials', () => {
    it('should get initials from first and last name', () => {
      expect(getAttendanceInitials('Juan', 'Pérez')).toBe('JP');
      expect(getAttendanceInitials('María', 'Rodríguez')).toBe('MR');
    });

    it('should handle missing first name', () => {
      expect(getAttendanceInitials('', 'Pérez')).toBe('P');
      expect(getAttendanceInitials(undefined as any, 'Pérez')).toBe('P');
    });

    it('should handle missing last name', () => {
      expect(getAttendanceInitials('Juan', '')).toBe('J');
      expect(getAttendanceInitials('Juan', undefined as any)).toBe('J');
    });

    it('should handle both names missing', () => {
      expect(getAttendanceInitials('', '')).toBe('');
      expect(getAttendanceInitials(undefined as any, undefined as any)).toBe('');
    });

    it('should convert to uppercase', () => {
      expect(getAttendanceInitials('juan', 'pérez')).toBe('JP');
    });
  });

  describe('isRecentAttendance', () => {
    it('should return true for attendance within last 24 hours', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      expect(isRecentAttendance(oneHourAgo.toISOString())).toBe(true);

      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      expect(isRecentAttendance(twelveHoursAgo.toISOString())).toBe(true);
    });

    it('should return false for attendance older than 24 hours', () => {
      const now = new Date();
      const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000);
      expect(isRecentAttendance(twentyFiveHoursAgo.toISOString())).toBe(false);

      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      expect(isRecentAttendance(twoDaysAgo.toISOString())).toBe(false);
    });

    it('should return true for attendance exactly 24 hours ago', () => {
      const now = new Date();
      const exactly24HoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      expect(isRecentAttendance(exactly24HoursAgo.toISOString())).toBe(true);
    });
  });

  describe('getAttendanceStatus', () => {
    it('should return recent status for attendance within 24 hours', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const status = getAttendanceStatus(oneHourAgo.toISOString());

      expect(status.label).toBe('Reciente');
      expect(status.variant).toBe('success');
    });

    it('should return completed status for attendance older than 24 hours', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const status = getAttendanceStatus(twoDaysAgo.toISOString());

      expect(status.label).toBe('Completado');
      expect(status.variant).toBe('default');
    });
  });

  describe('sortAttendances', () => {
    const mockAttendances: AttendanceWithClient[] = [
      {
        id: '1',
        client_id: 'client-1',
        check_in: '2024-01-01T10:00:00Z',
        check_out: null,
        client: {
          id: 'client-1',
          first_name: 'Juan',
          last_name: 'Pérez',
        },
      } as AttendanceWithClient,
      {
        id: '2',
        client_id: 'client-2',
        check_in: '2024-01-02T10:00:00Z',
        check_out: null,
        client: {
          id: 'client-2',
          first_name: 'María',
          last_name: 'Rodríguez',
        },
      } as AttendanceWithClient,
      {
        id: '3',
        client_id: 'client-3',
        check_in: '2024-01-03T10:00:00Z',
        check_out: null,
        client: {
          id: 'client-3',
          first_name: 'Carlos',
          last_name: 'López',
        },
      } as AttendanceWithClient,
    ];

    it('should sort by check_in ascending', () => {
      const sorted = sortAttendances([...mockAttendances].reverse(), 'check_in', 'asc');
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
    });

    it('should sort by check_in descending', () => {
      const sorted = sortAttendances([...mockAttendances], 'check_in', 'desc');
      expect(sorted[0].id).toBe('3');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('1');
    });

    it('should handle null values correctly', () => {
      const attendancesWithNull = [
        ...mockAttendances,
        {
          id: '4',
          client_id: 'client-4',
          check_in: null as any,
          check_out: null,
          client: {
            id: 'client-4',
            first_name: 'Ana',
            last_name: 'García',
          },
        } as AttendanceWithClient,
      ];

      const sorted = sortAttendances(attendancesWithNull, 'check_in', 'asc');
      // Null values should be placed at the end
      expect(sorted[sorted.length - 1].id).toBe('4');
    });

    it('should handle empty array', () => {
      expect(sortAttendances([], 'check_in', 'asc')).toEqual([]);
    });

    it('should handle single item array', () => {
      expect(sortAttendances([mockAttendances[0]], 'check_in', 'asc')).toHaveLength(1);
    });
  });
});

