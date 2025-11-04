/**
 * Tests for subscription helper functions
 */
import { describe, it, expect } from 'vitest';
import {
  getSubscriptionDuration,
  getDaysRemaining,
  getSubscriptionProgress,
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
});
