import { format, parseISO, isValid, differenceInDays, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { Subscription, SubscriptionStatus } from '../api/types';
import { SUBSCRIPTION_STATUS_CONFIG } from '../constants/subscriptionConstants';

// Subscription Helper Functions

/**
 * Format a date string for display
 */
export const formatDate = (dateString: string, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Fecha inválida';
    return format(date, formatStr, { locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Format a datetime string for display
 */
export const formatDateTime = (dateString: string): string => {
  return formatDate(dateString, 'dd/MM/yyyy');
};

/**
 * Check if a subscription is active
 */
export const isSubscriptionActive = (subscription: Subscription): boolean => {
  return subscription.status === SubscriptionStatus.ACTIVE;
};

/**
 * Check if a subscription is expired
 */
export const isSubscriptionExpired = (subscription: Subscription): boolean => {
  if (subscription.status === SubscriptionStatus.EXPIRED) return true;
  
  const endDate = parseISO(subscription.end_date);
  const today = new Date();
  
  return isAfter(today, endDate);
};

/**
 * Get days remaining for a subscription
 * Includes the current day if the subscription ends today
 */
export const getDaysRemaining = (subscription: Subscription): number => {
  const endDate = parseISO(subscription.end_date);
  const today = new Date();
  
  // Set both dates to start of day for accurate comparison
  const endDateStart = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // If end date is before today, subscription has expired
  if (isBefore(endDateStart, todayStart)) return 0;
  
  // Calculate difference including the current day
  // If subscription ends today, it should show 1 day remaining
  const daysDiff = differenceInDays(endDateStart, todayStart);
  return daysDiff + 1;
};

/**
 * Get subscription status display info
 */
export const getSubscriptionStatusInfo = (status: SubscriptionStatus) => {
  return SUBSCRIPTION_STATUS_CONFIG[status] || SUBSCRIPTION_STATUS_CONFIG[SubscriptionStatus.EXPIRED];
};

/**
 * Check if a subscription can be renewed
 */
export const canRenewSubscription = (subscription: Subscription): boolean => {
  const allowedStatuses = [SubscriptionStatus.EXPIRED, SubscriptionStatus.ACTIVE];
  return allowedStatuses.includes(subscription.status);
};

/**
 * Check if a subscription can be canceled
 */
export const canCancelSubscription = (subscription: Subscription): boolean => {
  const allowedStatuses = [SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING_PAYMENT, SubscriptionStatus.SCHEDULED];
  return allowedStatuses.includes(subscription.status);
};

/**
 * Get subscription duration in days
 * Includes both start and end dates in the calculation
 */
export const getSubscriptionDuration = (subscription: Subscription): number => {
  const startDate = parseISO(subscription.start_date);
  const endDate = parseISO(subscription.end_date);
  
  // Set both dates to start of day for accurate comparison
  const startDateStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endDateStart = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  // Include both start and end dates in the duration
  // If start and end are the same day, duration should be 1 day
  const daysDiff = differenceInDays(endDateStart, startDateStart);
  return daysDiff + 1;
};

/**
 * Calculate subscription progress percentage
 * Uses the corrected day calculation that includes both start and end dates
 */
export const getSubscriptionProgress = (subscription: Subscription): number => {
  const startDate = parseISO(subscription.start_date);
  const endDate = parseISO(subscription.end_date);
  const today = new Date();
  
  // Set all dates to start of day for accurate comparison
  const startDateStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endDateStart = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Calculate total duration including both start and end dates
  const totalDays = differenceInDays(endDateStart, startDateStart) + 1;
  
  // Calculate elapsed days including the start date
  const elapsedDays = Math.max(0, differenceInDays(todayStart, startDateStart) + 1);
  
  if (totalDays <= 0) return 100;
  
  const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  return Math.round(progress);
};

/**
 * Sort subscriptions by status priority
 */
export const sortSubscriptionsByStatus = (subscriptions: Subscription[]): Subscription[] => {
  const statusPriority = {
    [SubscriptionStatus.ACTIVE]: 1,
    [SubscriptionStatus.PENDING_PAYMENT]: 2,
    [SubscriptionStatus.SCHEDULED]: 3,
    [SubscriptionStatus.EXPIRED]: 4,
    [SubscriptionStatus.CANCELED]: 5,
  };

  return [...subscriptions].sort((a, b) => {
    const priorityA = statusPriority[a.status] || 999;
    const priorityB = statusPriority[b.status] || 999;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // If same priority, sort by end date
    return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
  });
};

/**
 * Filter subscriptions by status
 */
export const filterSubscriptionsByStatus = (
  subscriptions: Subscription[],
  status: SubscriptionStatus
): Subscription[] => {
  return subscriptions.filter(subscription => subscription.status === status);
};

/**
 * Get active subscriptions
 */
export const getActiveSubscriptions = (subscriptions: Subscription[]): Subscription[] => {
  return filterSubscriptionsByStatus(subscriptions, SubscriptionStatus.ACTIVE);
};

/**
 * Get expired subscriptions
 */
export const getExpiredSubscriptions = (subscriptions: Subscription[]): Subscription[] => {
  return subscriptions.filter(subscription => 
    subscription.status === SubscriptionStatus.EXPIRED || isSubscriptionExpired(subscription)
  );
};

/**
 * Get subscriptions requiring payment
 */
export const getSubscriptionsRequiringPayment = (subscriptions: Subscription[]): Subscription[] => {
  return filterSubscriptionsByStatus(subscriptions, SubscriptionStatus.PENDING_PAYMENT);
};
