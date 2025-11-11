import { apiClient, logger } from '../../../shared';
import { User, UserCreateInput, UserUpdateInput, PasswordResetInput, UserRole } from './types';

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<User[]> => {
  logger.debug('getAllUsers called');
  
  try {
    const data = await apiClient.get<User[]>('/users');
    logger.debug('getAllUsers response:', data);
    return data;
  } catch (error) {
    logger.error('getAllUsers error:', error);
    throw error;
  }
};

/**
 * Get user by username (admin only)
 */
export const getUserByUsername = async (username: string): Promise<User> => {
  logger.debug('getUserByUsername called with:', { username });
  
  try {
    const data = await apiClient.get<User>(`/users/${username}`);
    logger.debug('getUserByUsername response:', data);
    return data;
  } catch (error) {
    logger.error('getUserByUsername error:', error);
    throw error;
  }
};

/**
 * Create a new user (admin only)
 */
export const createUser = async (userData: UserCreateInput): Promise<User> => {
  logger.debug('createUser called with:', userData);
  
  try {
    const data = await apiClient.post<User>('/auth/register', userData);
    logger.debug('createUser response:', data);
    return data;
  } catch (error) {
    logger.error('createUser error:', error);
    throw error;
  }
};

/**
 * Update user (admin only)
 */
export const updateUser = async (
  username: string,
  userData: UserUpdateInput
): Promise<User> => {
  logger.debug('updateUser called with:', { username, userData });
  
  try {
    const data = await apiClient.put<User>(`/users/${username}`, userData);
    logger.debug('updateUser response:', data);
    return data;
  } catch (error) {
    logger.error('updateUser error:', error);
    throw error;
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (username: string): Promise<void> => {
  logger.debug('deleteUser called with:', { username });
  
  try {
    await apiClient.delete(`/users/${username}`);
    logger.debug('deleteUser success');
  } catch (error) {
    logger.error('deleteUser error:', error);
    throw error;
  }
};

/**
 * Reset user password (admin only)
 */
export const resetUserPassword = async (
  username: string,
  newPassword: string
): Promise<{ message: string }> => {
  logger.debug('resetUserPassword called with:', { username });
  
  try {
    // FastAPI expects the body parameter as JSON with the parameter name
    const data = await apiClient.patch<{ message: string }>(
      `/users/${username}/password`,
      newPassword
    );
    logger.debug('resetUserPassword response:', data);
    return data;
  } catch (error) {
    logger.error('resetUserPassword error:', error);
    throw error;
  }
};

/**
 * Change user role (admin only)
 */
export const changeUserRole = async (
  username: string,
  role: UserRole
): Promise<User> => {
  logger.debug('changeUserRole called with:', { username, role });
  
  try {
    // FastAPI expects the body parameter as JSON with the parameter name
    const data = await apiClient.patch<User>(`/users/${username}/role`, role);
    logger.debug('changeUserRole response:', data);
    return data;
  } catch (error) {
    logger.error('changeUserRole error:', error);
    throw error;
  }
};

/**
 * Enable user (admin only)
 */
export const enableUser = async (username: string): Promise<User> => {
  logger.debug('enableUser called with:', { username });
  
  try {
    const data = await apiClient.patch<User>(`/users/${username}/enable`);
    logger.debug('enableUser response:', data);
    return data;
  } catch (error) {
    logger.error('enableUser error:', error);
    throw error;
  }
};

/**
 * Disable user (admin only)
 */
export const disableUser = async (username: string): Promise<User> => {
  logger.debug('disableUser called with:', { username });
  
  try {
    const data = await apiClient.patch<User>(`/users/${username}/disable`);
    logger.debug('disableUser response:', data);
    return data;
  } catch (error) {
    logger.error('disableUser error:', error);
    throw error;
  }
};

