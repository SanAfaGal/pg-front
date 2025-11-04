/**
 * Tests for subscription helper functions
 */
import { describe, it, expect } from 'vitest';
import {
  getSubscriptionDuration,
  getDaysRemaining,
  getSubscriptionProgress,
  formatDate,
  formatDateTime,
  isSubscriptionActive,
  isSubscriptionExpired,
  getSubscriptionStatusInfo,
  canRenewSubscription,
  canCancelSubscription,
  sortSubscriptionsByStatus,
  filterSubscriptionsByStatus,
  getActiveSubscriptions,
  getExpiredSubscriptions,
  getSubscriptionsRequiringPayment,
  getLastExpiredSubscription,
} from './subscriptionHelpers';
import { Subscription, SubscriptionStatus } from '../api/types';

// Mock subscription for testing
const createMockSubscription = (
  startDate: string,
  endDate: string,
  status: SubscriptionStatus = SubscriptionStatus.ACTIVE
): Subscription => ({
  id: 'test-id',
  client_id: 'client-id',
  plan_id: 'plan-id',
  start_date: startDate,
  end_date: endDate,
  status,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
});

describe('subscriptionHelpers', () => {
  describe('getSubscriptionDuration', () => {
    it('should calculate duration for same day subscription', () => {
      const today = new Date().toISOString().split('T')[0];
      const subscription = createMockSubscription(today, today);
      expect(getSubscriptionDuration(subscription)).toBe(1);
    });

    it('should calculate duration for 30-day subscription', () => {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 29); // +29 because we include both start and end
      const subscription = createMockSubscription(
        today.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      expect(getSubscriptionDuration(subscription)).toBe(30);
    });

    it('should calculate duration for subscription ending today', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
  const today = new Date().toISOString().split('T')[0];
      const subscription = createMockSubscription(
        yesterday.toISOString().split('T')[0],
        today
      );
      expect(getSubscriptionDuration(subscription)).toBe(2);
    });
  });

  describe('getDaysRemaining', () => {
    it('should return 0 for expired subscription', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dayBeforeYesterday = new Date(yesterday);
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);
      const subscription = createMockSubscription(
        dayBeforeYesterday.toISOString().split('T')[0],
        yesterday.toISOString().split('T')[0],
        SubscriptionStatus.EXPIRED
      );
      expect(getDaysRemaining(subscription)).toBe(0);
    });

    it('should calculate remaining days for active subscription', () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const subscription = createMockSubscription(
        today.toISOString().split('T')[0],
        tomorrow.toISOString().split('T')[0]
      );
      expect(getDaysRemaining(subscription)).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getSubscriptionProgress', () => {
    it('should return 100% for same day subscription', () => {
      const today = new Date().toISOString().split('T')[0];
      const subscription = createMockSubscription(today, today);
      expect(getSubscriptionProgress(subscription)).toBe(100);
    });

    it('should return 100% for expired subscription', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
      const dayBeforeYesterday = new Date(yesterday);
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);
      const subscription = createMockSubscription(
        dayBeforeYesterday.toISOString().split('T')[0],
        yesterday.toISOString().split('T')[0],
        SubscriptionStatus.EXPIRED
      );
      expect(getSubscriptionProgress(subscription)).toBe(100);
    });

    it('should calculate progress for active subscription', () => {
      const today = new Date();
      const in30Days = new Date(today);
      in30Days.setDate(in30Days.getDate() + 29);
      const subscription = createMockSubscription(
        today.toISOString().split('T')[0],
        in30Days.toISOString().split('T')[0]
      );
      const progress = getSubscriptionProgress(subscription);
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThanOrEqual(100);
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should handle invalid date', () => {
      expect(formatDate('invalid-date')).toBe('Fecha inválida');
    });

    it('should use custom format string', () => {
      const formatted = formatDate('2024-01-15', 'yyyy-MM-dd');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime string', () => {
      const formatted = formatDateTime('2024-01-15T10:30:00Z');
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('isSubscriptionActive', () => {
    it('should return true for active subscription', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.ACTIVE
      );
      expect(isSubscriptionActive(subscription)).toBe(true);
    });

    it('should return false for non-active subscription', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.EXPIRED
      );
      expect(isSubscriptionActive(subscription)).toBe(false);
    });
  });

  describe('isSubscriptionExpired', () => {
    it('should return true for expired status', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.EXPIRED
      );
      expect(isSubscriptionExpired(subscription)).toBe(true);
    });

    it('should return true for subscription with past end date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const subscription = createMockSubscription(
        lastWeek.toISOString().split('T')[0],
        yesterday.toISOString().split('T')[0],
        SubscriptionStatus.ACTIVE
      );
      expect(isSubscriptionExpired(subscription)).toBe(true);
    });

    it('should return false for active subscription with future end date', () => {
      const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

      const subscription = createMockSubscription(
        today.toISOString().split('T')[0],
        tomorrow.toISOString().split('T')[0],
        SubscriptionStatus.ACTIVE
      );
      expect(isSubscriptionExpired(subscription)).toBe(false);
    });
  });

  describe('getSubscriptionStatusInfo', () => {
    it('should return status info for each status', () => {
      expect(getSubscriptionStatusInfo(SubscriptionStatus.ACTIVE)).toBeDefined();
      expect(getSubscriptionStatusInfo(SubscriptionStatus.EXPIRED)).toBeDefined();
      expect(getSubscriptionStatusInfo(SubscriptionStatus.CANCELED)).toBeDefined();
      expect(getSubscriptionStatusInfo(SubscriptionStatus.PENDING_PAYMENT)).toBeDefined();
    });
  });

  describe('canRenewSubscription', () => {
    it('should return true for expired subscription', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.EXPIRED
      );
      expect(canRenewSubscription(subscription)).toBe(true);
    });

    it('should return true for active subscription', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.ACTIVE
      );
      expect(canRenewSubscription(subscription)).toBe(true);
    });

    it('should return false for canceled subscription', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.CANCELED
      );
      expect(canRenewSubscription(subscription)).toBe(false);
    });
  });

  describe('canCancelSubscription', () => {
    it('should return true for active subscription', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.ACTIVE
      );
      expect(canCancelSubscription(subscription)).toBe(true);
    });

    it('should return true for pending payment subscription', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.PENDING_PAYMENT
      );
      expect(canCancelSubscription(subscription)).toBe(true);
    });

    it('should return false for expired subscription', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.EXPIRED
      );
      expect(canCancelSubscription(subscription)).toBe(false);
    });

    it('should return false for canceled subscription', () => {
      const subscription = createMockSubscription(
        '2024-01-01',
        '2024-01-31',
        SubscriptionStatus.CANCELED
      );
      expect(canCancelSubscription(subscription)).toBe(false);
    });
  });

  describe('sortSubscriptionsByStatus', () => {
    it('should sort subscriptions by status priority', () => {
      const subscriptions: Subscription[] = [
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.EXPIRED),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.ACTIVE),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.PENDING_PAYMENT),
      ];

      const sorted = sortSubscriptionsByStatus(subscriptions);
      expect(sorted[0].status).toBe(SubscriptionStatus.ACTIVE);
      expect(sorted[1].status).toBe(SubscriptionStatus.PENDING_PAYMENT);
      expect(sorted[2].status).toBe(SubscriptionStatus.EXPIRED);
    });

    it('should sort by end date when status priority is same', () => {
      const subscriptions: Subscription[] = [
        createMockSubscription('2024-01-01', '2024-02-01', SubscriptionStatus.ACTIVE),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.ACTIVE),
      ];

      const sorted = sortSubscriptionsByStatus(subscriptions);
      expect(new Date(sorted[0].end_date).getTime()).toBeGreaterThan(
        new Date(sorted[1].end_date).getTime()
      );
    });
  });

  describe('filterSubscriptionsByStatus', () => {
    it('should filter subscriptions by status', () => {
      const subscriptions: Subscription[] = [
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.ACTIVE),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.EXPIRED),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.ACTIVE),
      ];

      const active = filterSubscriptionsByStatus(subscriptions, SubscriptionStatus.ACTIVE);
      expect(active.length).toBe(2);
      expect(active.every(sub => sub.status === SubscriptionStatus.ACTIVE)).toBe(true);
    });
  });

  describe('getActiveSubscriptions', () => {
    it('should return only active subscriptions', () => {
      const subscriptions: Subscription[] = [
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.ACTIVE),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.EXPIRED),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.ACTIVE),
      ];

      const active = getActiveSubscriptions(subscriptions);
      expect(active.length).toBe(2);
    });
  });

  describe('getExpiredSubscriptions', () => {
    it('should return expired subscriptions', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const subscriptions: Subscription[] = [
        createMockSubscription(
          lastWeek.toISOString().split('T')[0],
          yesterday.toISOString().split('T')[0],
          SubscriptionStatus.ACTIVE
        ),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.EXPIRED),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.ACTIVE),
      ];

      const expired = getExpiredSubscriptions(subscriptions);
      expect(expired.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getSubscriptionsRequiringPayment', () => {
    it('should return subscriptions with pending payment status', () => {
      const subscriptions: Subscription[] = [
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.PENDING_PAYMENT),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.ACTIVE),
        createMockSubscription('2024-01-01', '2024-01-31', SubscriptionStatus.PENDING_PAYMENT),
      ];

      const pending = getSubscriptionsRequiringPayment(subscriptions);
      expect(pending.length).toBe(2);
    });
  });

  describe('getLastExpiredSubscription', () => {
    it('should return the most recent expired subscription', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);

      const subscriptions: Subscription[] = [
        createMockSubscription(
          lastMonth.toISOString().split('T')[0],
          lastWeek.toISOString().split('T')[0],
          SubscriptionStatus.EXPIRED
        ),
        createMockSubscription(
          lastWeek.toISOString().split('T')[0],
          yesterday.toISOString().split('T')[0],
          SubscriptionStatus.EXPIRED
        ),
      ];

      const lastExpired = getLastExpiredSubscription(subscriptions);
      expect(lastExpired).not.toBeNull();
      expect(lastExpired?.end_date).toBe(yesterday.toISOString().split('T')[0]);
    });

    it('should return null if no expired subscriptions', () => {
      // Use future dates to ensure subscription is not expired
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      const subscriptions: Subscription[] = [
        createMockSubscription('2024-01-01', futureDateStr, SubscriptionStatus.ACTIVE),
      ];

      expect(getLastExpiredSubscription(subscriptions)).toBeNull();
    });

    it('should return null for empty array', () => {
      expect(getLastExpiredSubscription([])).toBeNull();
    });
  });
});
