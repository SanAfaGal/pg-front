import { Reward, RewardStatus } from '../types';
import { REWARD_RULES, ELIGIBLE_PLAN_UNITS } from '../constants/rewardConstants';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Verifies if a reward is expired
 */
export function isRewardExpired(reward: Reward): boolean {
  if (!reward.expires_at) return false;
  return new Date(reward.expires_at) < new Date();
}

/**
 * Verifies if a reward is available (pending and not expired)
 */
export function isRewardAvailable(reward: Reward): boolean {
  return reward.status === RewardStatus.PENDING && !isRewardExpired(reward);
}

/**
 * Converts discount percentage to number (handles both string and number)
 */
function toNumber(value: number | string): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Formats the discount percentage for display
 */
export function formatDiscount(percentage: number | string): string {
  const num = toNumber(percentage);
  return `${num.toFixed(0)}%`;
}

/**
 * Calculates the price with discount applied
 */
export function calculateDiscountedPrice(originalPrice: number, discountPercentage: number | string): number {
  const discount = toNumber(discountPercentage);
  return originalPrice * (1 - discount / 100);
}

/**
 * Calculates the amount saved with discount
 */
export function calculateDiscountAmount(originalPrice: number, discountPercentage: number | string): number {
  const discount = toNumber(discountPercentage);
  return originalPrice - calculateDiscountedPrice(originalPrice, discount);
}

/**
 * Formats the expiration date
 */
export function formatExpirationDate(expiresAt: string): string {
  try {
    const date = parseISO(expiresAt);
    return format(date, 'dd \'de\' MMMM, yyyy', { locale: es });
  } catch {
    return expiresAt;
  }
}

/**
 * Gets days until expiration
 * Returns negative number if already expired
 */
export function getDaysUntilExpiration(expiresAt: string): number {
  const now = new Date();
  const expiration = new Date(expiresAt);
  const diffTime = expiration.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Formats days until expiration for display
 */
export function formatDaysUntilExpiration(expiresAt: string): string {
  const days = getDaysUntilExpiration(expiresAt);
  
  if (days < 0) {
    return 'Expirada';
  }
  
  if (days === 0) {
    return 'Expira hoy';
  }
  
  if (days === 1) {
    return 'Expira mañana';
  }
  
  return `Expira en ${days} días`;
}

/**
 * Formats the eligible date
 */
export function formatEligibleDate(eligibleDate: string): string {
  try {
    const date = parseISO(eligibleDate);
    return format(date, 'dd \'de\' MMMM, yyyy', { locale: es });
  } catch {
    return eligibleDate;
  }
}

/**
 * Formats the applied date
 */
export function formatAppliedDate(appliedAt: string): string {
  try {
    const date = parseISO(appliedAt);
    return format(date, 'dd \'de\' MMMM, yyyy \'a las\' HH:mm', { locale: es });
  } catch {
    return appliedAt;
  }
}

/**
 * Validates discount percentage
 */
export function isValidDiscountPercentage(percentage: number | string): boolean {
  const num = toNumber(percentage);
  return (
    num >= REWARD_RULES.MIN_DISCOUNT &&
    num <= REWARD_RULES.MAX_DISCOUNT
  );
}

/**
 * Gets reward status display info
 */
export function getRewardStatusInfo(status: RewardStatus) {
  const statusConfig = {
    [RewardStatus.PENDING]: {
      label: 'Pendiente',
      color: 'info',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
    },
    [RewardStatus.APPLIED]: {
      label: 'Aplicada',
      color: 'success',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
    },
    [RewardStatus.EXPIRED]: {
      label: 'Expirada',
      color: 'default',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
    },
  };

  return statusConfig[status] || statusConfig[RewardStatus.PENDING];
}

/**
 * Filters available rewards from a list
 */
export function filterAvailableRewards(rewards: Reward[]): Reward[] {
  return rewards.filter(isRewardAvailable);
}

/**
 * Checks if a plan is eligible for rewards (monthly plans only)
 */
export function isPlanEligibleForRewards(planDurationUnit: string): boolean {
  return (ELIGIBLE_PLAN_UNITS as readonly string[]).includes(planDurationUnit);
}

/**
 * Checks if subscription cycle has ended (can calculate reward)
 */
export function canCalculateReward(subscriptionEndDate: string): boolean {
  const endDate = parseISO(subscriptionEndDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  return endDate <= today;
}

/**
 * Obtiene el precio efectivo de una suscripción.
 * 
 * Si la suscripción tiene final_price (descuento aplicado), usa ese valor.
 * De lo contrario, usa el precio del plan.
 * 
 * @param subscription - Suscripción con final_price opcional
 * @param planPrice - Precio del plan (fallback)
 * @returns Precio efectivo a pagar
 */
export function getSubscriptionPrice(
  subscription?: { final_price?: number | null },
  planPrice?: number | string
): number {
  if (subscription?.final_price != null) {
    return subscription.final_price;
  }
  
  // Convert planPrice to number if it's a string
  if (typeof planPrice === 'string') {
    const parsed = parseFloat(planPrice);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return planPrice ?? 0;
}

