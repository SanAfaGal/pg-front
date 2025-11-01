import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID, PaginationParams } from '../../../shared/types/common';
import { subscriptionKeys } from '../api/types';
import {
  createPayment,
  getPayments,
  getPaymentStats,
  getPaymentById,
  updatePayment,
  deletePayment,
  getClientPaymentHistory,
  getClientPaymentStats,
} from '../api/paymentApi';
import {
  Payment,
  PaymentCreateInput,
  PaymentStats,
  PaymentWithDebtInfo,
} from '../api/types';
import { QUERY_STALE_TIMES, QUERY_CACHE_TIMES, RETRY_CONFIG } from '../constants/subscriptionConstants';

// Hook to get all payments for a subscription
export const usePayments = (
  subscriptionId: UUID,
  params: PaginationParams = {}
) => {
  return useQuery({
    queryKey: [...subscriptionKeys.payments(subscriptionId), params],
    queryFn: () => getPayments(subscriptionId, params),
    staleTime: QUERY_STALE_TIMES.payments,
    gcTime: QUERY_CACHE_TIMES.payments,
    enabled: !!subscriptionId,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to get payment statistics for a subscription
export const usePaymentStats = (subscriptionId: UUID) => {
  return useQuery({
    queryKey: subscriptionKeys.paymentStats(subscriptionId),
    queryFn: () => getPaymentStats(subscriptionId),
    staleTime: QUERY_STALE_TIMES.stats,
    gcTime: QUERY_CACHE_TIMES.stats,
    enabled: !!subscriptionId,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to get payment by ID
export const usePaymentDetails = (paymentId: UUID) => {
  return useQuery({
    queryKey: ['payments', 'detail', paymentId],
    queryFn: () => getPaymentById(paymentId),
    staleTime: QUERY_STALE_TIMES.payments,
    gcTime: QUERY_CACHE_TIMES.payments,
    enabled: !!paymentId,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to create a payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId, 
      data,
      clientId,
    }: { 
      subscriptionId: UUID; 
      data: PaymentCreateInput;
      clientId?: UUID;
    }) => createPayment(subscriptionId, data),
    onMutate: async ({ subscriptionId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: subscriptionKeys.payments(subscriptionId),
      });
      await queryClient.cancelQueries({
        queryKey: subscriptionKeys.paymentStats(subscriptionId),
      });

      // Snapshot the previous values
      const previousPayments = queryClient.getQueryData<Payment[]>(
        subscriptionKeys.payments(subscriptionId)
      );
      const previousStats = queryClient.getQueryData<PaymentStats>(
        subscriptionKeys.paymentStats(subscriptionId)
      );

      // Optimistically update the payments list
      const optimisticPayment: Payment = {
        id: `temp-${Date.now()}`,
        subscription_id: subscriptionId,
        amount: data.amount,
        payment_method: data.payment_method,
        payment_date: new Date().toISOString(),
        meta_info: {},
      };

      queryClient.setQueryData<Payment[]>(
        subscriptionKeys.payments(subscriptionId),
        (old: Payment[] = []) => [optimisticPayment, ...old]
      );

      // Optimistically update payment stats if available
      if (previousStats) {
        const amountPaid = parseFloat(data.amount);
        const newTotalPaid = parseFloat(previousStats.total_amount_paid) + amountPaid;
        const newRemainingDebt = Math.max(0, parseFloat(previousStats.remaining_debt) - amountPaid);

        queryClient.setQueryData<PaymentStats>(
          subscriptionKeys.paymentStats(subscriptionId),
          (old) => ({
            ...old!,
            total_payments: (old?.total_payments || 0) + 1,
            total_amount_paid: newTotalPaid.toString(),
            remaining_debt: newRemainingDebt.toString(),
            last_payment_date: new Date().toISOString(),
          })
        );
      }

      return { previousPayments, previousStats };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPayments !== undefined) {
        queryClient.setQueryData(
          subscriptionKeys.payments(variables.subscriptionId),
          context.previousPayments
        );
      }
      if (context?.previousStats !== undefined) {
        queryClient.setQueryData(
          subscriptionKeys.paymentStats(variables.subscriptionId),
          context.previousStats
        );
      }
    },
    onSuccess: (data, variables) => {
      const { subscriptionId, clientId } = variables;

      // Update payment in cache with real data from server
      queryClient.setQueryData(
        subscriptionKeys.payments(subscriptionId),
        (old: Payment[] = []) => {
          // Remove optimistic payment
          const filtered = old.filter(p => !p.id.startsWith('temp-'));
          return [data.payment, ...filtered];
        }
      );

      // Invalidate and refetch payment stats to get accurate data
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.paymentStats(subscriptionId),
      });

      // CRITICAL: Invalidate subscription detail to refresh status
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(subscriptionId),
      });

      // CRITICAL: If we have clientId, invalidate client-specific queries
      if (clientId) {
        // Invalidate subscriptions list for this client
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.list(clientId),
        });

        // CRITICAL: Invalidate active subscription to refresh status
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.active(clientId),
        });

        // Invalidate client payment history if exists
        queryClient.invalidateQueries({
          queryKey: ['payments', 'client', clientId],
        });
      } else {
        // Fallback: Invalidate all subscription lists if clientId not provided
        // This ensures status updates but is less efficient
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.lists(),
        });
      }

      // Add the new payment to cache
      queryClient.setQueryData(
        ['payments', 'detail', data.payment.id],
        data.payment
      );

      // If subscription status changed in response, update subscription cache
      if (data.subscription_status) {
        queryClient.setQueryData(
          subscriptionKeys.detail(subscriptionId),
          (old: any) => {
            if (!old) return old;
            return {
              ...old,
              status: data.subscription_status,
              updated_at: new Date().toISOString(),
            };
          }
        );
      }
    },
  });
};

// Hook to update a payment
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      paymentId, 
      data,
      subscriptionId,
      clientId,
    }: { 
      paymentId: UUID; 
      data: Partial<PaymentCreateInput>;
      subscriptionId?: UUID;
      clientId?: UUID;
    }) => updatePayment(paymentId, data),
    onSuccess: (data, variables) => {
      const { paymentId, subscriptionId, clientId } = variables;

      // Update the payment in cache
      queryClient.setQueryData(
        ['payments', 'detail', paymentId],
        data
      );

      // Invalidate payment lists and stats if subscriptionId available
      if (subscriptionId) {
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.payments(subscriptionId),
        });
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.paymentStats(subscriptionId),
        });
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.detail(subscriptionId),
        });
      } else {
        // Fallback: invalidate all payments
        queryClient.invalidateQueries({
          queryKey: ['payments'],
        });
      }

      // If clientId available, invalidate client-specific queries
      if (clientId) {
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.list(clientId),
        });
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.active(clientId),
        });
      }
    },
  });
};

// Hook to delete a payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      paymentId,
      subscriptionId,
      clientId,
    }: { 
      paymentId: UUID;
      subscriptionId?: UUID;
      clientId?: UUID;
    }) => deletePayment(paymentId),
    onSuccess: (_, variables) => {
      const { paymentId, subscriptionId, clientId } = variables;

      // Remove payment from cache
      queryClient.removeQueries({
        queryKey: ['payments', 'detail', paymentId],
      });

      // Invalidate payment lists and stats if subscriptionId available
      if (subscriptionId) {
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.payments(subscriptionId),
        });
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.paymentStats(subscriptionId),
        });
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.detail(subscriptionId),
        });
      } else {
        // Fallback: invalidate all payments
        queryClient.invalidateQueries({
          queryKey: ['payments'],
        });
      }

      // If clientId available, invalidate client-specific queries
      if (clientId) {
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.list(clientId),
        });
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.active(clientId),
        });
      }
    },
  });
};

// Hook to get client payment history
export const useClientPaymentHistory = (
  clientId: UUID,
  params: PaginationParams = {}
) => {
  return useQuery({
    queryKey: ['payments', 'client', clientId, params],
    queryFn: () => getClientPaymentHistory(clientId, params),
    staleTime: QUERY_STALE_TIMES.payments,
    gcTime: QUERY_CACHE_TIMES.payments,
    enabled: !!clientId,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};

// Hook to get client payment statistics
export const useClientPaymentStats = (clientId: UUID) => {
  return useQuery({
    queryKey: ['payments', 'client', clientId, 'stats'],
    queryFn: () => getClientPaymentStats(clientId),
    staleTime: QUERY_STALE_TIMES.stats,
    gcTime: QUERY_CACHE_TIMES.stats,
    enabled: !!clientId,
    retry: RETRY_CONFIG.retries,
    retryDelay: RETRY_CONFIG.retryDelay,
  });
};
