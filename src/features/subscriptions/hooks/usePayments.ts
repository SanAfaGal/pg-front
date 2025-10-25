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

// Hook to get all payments for a subscription
export const usePayments = (
  subscriptionId: UUID,
  params: PaginationParams = {}
) => {
  return useQuery({
    queryKey: [...subscriptionKeys.payments(subscriptionId), params],
    queryFn: () => getPayments(subscriptionId, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!subscriptionId,
  });
};

// Hook to get payment statistics for a subscription
export const usePaymentStats = (subscriptionId: UUID) => {
  return useQuery({
    queryKey: subscriptionKeys.paymentStats(subscriptionId),
    queryFn: () => getPaymentStats(subscriptionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!subscriptionId,
  });
};

// Hook to get payment by ID
export const usePaymentDetails = (paymentId: UUID) => {
  return useQuery({
    queryKey: ['payments', 'detail', paymentId],
    queryFn: () => getPaymentById(paymentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!paymentId,
  });
};

// Hook to create a payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId, 
      data 
    }: { 
      subscriptionId: UUID; 
      data: PaymentCreateInput 
    }) => createPayment(subscriptionId, data),
    onMutate: async ({ subscriptionId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: subscriptionKeys.payments(subscriptionId),
      });

      // Snapshot the previous value
      const previousPayments = queryClient.getQueryData(
        subscriptionKeys.payments(subscriptionId)
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

      queryClient.setQueryData(
        subscriptionKeys.payments(subscriptionId),
        (old: Payment[] = []) => [optimisticPayment, ...old]
      );

      return { previousPayments };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPayments) {
        queryClient.setQueryData(
          subscriptionKeys.payments(variables.subscriptionId),
          context.previousPayments
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate payments list
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.payments(variables.subscriptionId),
      });

      // Invalidate payment stats
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.paymentStats(variables.subscriptionId),
      });

      // Invalidate subscription details (in case status changed)
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.detail(variables.subscriptionId),
      });

      // CRITICAL: Invalidate ALL subscription-related queries to refresh status
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.all(),
      });

      // Invalidate client-specific queries (active subscription, etc.)
      // Note: We'll need to get client_id from the subscription or pass it separately
      // For now, we invalidate all subscription queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.lists(),
      });

      // Add the new payment to cache
      queryClient.setQueryData(
        ['payments', 'detail', data.payment.id],
        data.payment
      );
    },
  });
};

// Hook to update a payment
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      paymentId, 
      data 
    }: { 
      paymentId: UUID; 
      data: Partial<PaymentCreateInput> 
    }) => updatePayment(paymentId, data),
    onSuccess: (data, variables) => {
      // Update the payment in cache
      queryClient.setQueryData(
        ['payments', 'detail', variables.paymentId],
        data
      );

      // Invalidate all payment lists to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ['payments'],
      });
    },
  });
};

// Hook to delete a payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: UUID) => deletePayment(paymentId),
    onSuccess: (_, paymentId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: ['payments', 'detail', paymentId],
      });

      // Invalidate all payment lists
      queryClient.invalidateQueries({
        queryKey: ['payments'],
      });
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!clientId,
  });
};

// Hook to get client payment statistics
export const useClientPaymentStats = (clientId: UUID) => {
  return useQuery({
    queryKey: ['payments', 'client', clientId, 'stats'],
    queryFn: () => getClientPaymentStats(clientId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!clientId,
  });
};
