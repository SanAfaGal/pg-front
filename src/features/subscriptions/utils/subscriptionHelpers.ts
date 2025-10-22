import { format, parseISO, isValid, differenceInDays, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { Subscription, SubscriptionStatus, Payment, PaymentMethod } from '../api/types';
import { SUBSCRIPTION_STATUS_CONFIG, PAYMENT_METHOD_CONFIG, CURRENCY_CONFIG } from '../constants/subscriptionConstants';

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
  return formatDate(dateString, 'dd/MM/yyyy HH:mm');
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
 */
export const getDaysRemaining = (subscription: Subscription): number => {
  const endDate = parseISO(subscription.end_date);
  const today = new Date();
  
  if (isAfter(today, endDate)) return 0;
  
  return differenceInDays(endDate, today);
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
 */
export const getSubscriptionDuration = (subscription: Subscription): number => {
  const startDate = parseISO(subscription.start_date);
  const endDate = parseISO(subscription.end_date);
  
  return differenceInDays(endDate, startDate);
};

/**
 * Calculate subscription progress percentage
 */
export const getSubscriptionProgress = (subscription: Subscription): number => {
  const startDate = parseISO(subscription.start_date);
  const endDate = parseISO(subscription.end_date);
  const today = new Date();
  
  const totalDays = differenceInDays(endDate, startDate);
  const elapsedDays = differenceInDays(today, startDate);
  
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
