// Reward Types
export enum RewardStatus {
  PENDING = 'pending',
  APPLIED = 'applied',
  EXPIRED = 'expired',
}

export interface Reward {
  id: string;
  subscription_id: string;
  client_id: string;
  attendance_count: number;
  discount_percentage: number | string; // Can be string from backend (decimal)
  eligible_date: string; // ISO date
  expires_at: string; // ISO datetime
  status: RewardStatus;
  applied_at?: string; // ISO datetime
  applied_subscription_id?: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  meta_info?: Record<string, unknown>;
}

export interface RewardEligibilityResponse {
  eligible: boolean;
  attendance_count: number;
  reward_id?: string;
  expires_at?: string; // ISO datetime
}

export interface RewardApplyInput {
  subscription_id: string;
  discount_percentage: number; // 0.01 a 100.0
}

// Query Keys Factory
export const rewardKeys = {
  all: ['rewards'] as const,
  lists: () => [...rewardKeys.all, 'list'] as const,
  eligibility: (subscriptionId: string) => [...rewardKeys.all, 'eligibility', subscriptionId] as const,
  available: (clientId: string) => [...rewardKeys.lists(), 'available', clientId] as const,
  bySubscription: (subscriptionId: string) => [...rewardKeys.lists(), 'subscription', subscriptionId] as const,
  detail: (id: string) => [...rewardKeys.all, 'detail', id] as const,
} as const;

