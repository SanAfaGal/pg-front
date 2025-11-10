import { Subscription, SubscriptionStatus } from '../api/types';
import { isSubscriptionExpired } from './subscriptionHelpers';

/**
 * Filter subscriptions that should appear in history
 * History should only show finalized subscriptions (expired, canceled)
 * Excludes: active, pending_payment, scheduled
 */
export const filterHistorySubscriptions = (subscriptions: Subscription[]): Subscription[] => {
  return subscriptions.filter(sub => {
    // Exclude active subscriptions
    if (sub.status === SubscriptionStatus.ACTIVE) return false;
    
    // Exclude pending payment subscriptions (they're not finalized)
    if (sub.status === SubscriptionStatus.PENDING_PAYMENT) return false;
    
    // Exclude scheduled subscriptions (they're future renewals)
    if (sub.status === SubscriptionStatus.SCHEDULED) return false;
    
    // Include expired and canceled subscriptions
    return sub.status === SubscriptionStatus.EXPIRED || 
           sub.status === SubscriptionStatus.CANCELED ||
           isSubscriptionExpired(sub);
  });
};

/**
 * Get scheduled subscription that will renew the active one
 * Returns the SCHEDULED subscription that starts after the active subscription ends
 */
export const getScheduledRenewal = (
  subscriptions: Subscription[],
  activeSubscription: Subscription | null
): Subscription | null => {
  if (!activeSubscription) return null;
  
  const scheduled = subscriptions.find(sub => 
    sub.status === SubscriptionStatus.SCHEDULED &&
    new Date(sub.start_date) > new Date(activeSubscription.end_date)
  );
  
  return scheduled || null;
};

/**
 * Check if a subscription can be renewed based on days remaining
 * Only allows renewal 3 days before the subscription ends
 */
export const canRenewByDaysRemaining = (subscription: Subscription): {
  canRenew: boolean;
  daysRemaining: number;
  message?: string;
} => {
  const endDate = new Date(subscription.end_date);
  const today = new Date();
  
  // Set both dates to start of day for accurate comparison
  const endDateStart = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Calculate days remaining (including today)
  const daysDiff = Math.ceil((endDateStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = daysDiff + 1;
  
  // Can only renew if 3 days or less remaining
  const canRenew = daysRemaining <= 3 && daysRemaining > 0;
  
  if (!canRenew && daysRemaining > 3) {
    return {
      canRenew: false,
      daysRemaining,
      message: `Solo se puede renovar 3 días antes de que termine la suscripción. Faltan ${daysRemaining} días.`
    };
  }
  
  if (daysRemaining <= 0) {
    return {
      canRenew: true,
      daysRemaining: 0,
      message: 'La suscripción ha expirado. Puedes renovarla ahora.'
    };
  }
  
  return {
    canRenew: true,
    daysRemaining
  };
};

