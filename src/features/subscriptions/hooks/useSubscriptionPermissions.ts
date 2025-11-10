import { useAuth } from '../../../features/auth/hooks/useAuth';

/**
 * Hook to check if current user is admin
 */
export const useIsAdmin = (): boolean => {
  const { user } = useAuth();
  // Check if user role is 'admin' (case insensitive)
  return user?.role?.toLowerCase() === 'admin';
};

/**
 * Hook to get subscription permissions
 */
export const useSubscriptionPermissions = () => {
  const isAdmin = useIsAdmin();
  
  return {
    canCancel: isAdmin,
    isAdmin,
  };
};

