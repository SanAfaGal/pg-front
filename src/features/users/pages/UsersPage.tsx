import React, { useState, useCallback, useMemo } from 'react';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResetPassword,
  useChangeRole,
  useEnableUser,
  useDisableUser,
  userKeys,
} from '../hooks/useUsers';
import { User, UserCreateInput, UserUpdateInput, UserFilters as UserFiltersType } from '../api/types';
import { UserList } from '../components/UserList';
import { UserForm } from '../components/UserForm';
import { PasswordResetModal } from '../components/PasswordResetModal';
import { Button } from '../../../components/ui/Button';
import { PageLayout } from '../../../components/ui/PageLayout';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { RefreshButton } from '../../../components/ui/RefreshButton';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast, logger } from '../../../shared';
import { useIsAdmin } from '../../subscriptions/hooks/useSubscriptionPermissions';
import { useAuth } from '../../auth';
import { Plus, AlertCircle, UserCog } from 'lucide-react';
import { NOTIFICATION_MESSAGES } from '../constants/userConstants';
import { useQueryClient } from '@tanstack/react-query';

export const UsersPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showRoleChange, setShowRoleChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState<UserFiltersType>({
    search: '',
    role: 'all',
    status: 'all',
  });

  const isAdmin = useIsAdmin();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Queries - enabled=false by default, only fetch on manual refresh
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    isRefetching: isUsersRefetching,
    refetch: refetchUsers,
  } = useUsers(false);

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetPassword();
  const changeRoleMutation = useChangeRole();
  const enableUserMutation = useEnableUser();
  const disableUserMutation = useDisableUser();

  const isLoading = usersLoading;
  const isRefetching = isUsersRefetching;

  // Check if user is admin
  if (!isAdmin) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Acceso Restringido
                </h3>
                <p className="text-sm text-yellow-700">
                  Solo los administradores pueden gestionar usuarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Handlers
  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowUserForm(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.username);
      showToast({
        type: 'success',
        title: 'Usuario eliminado',
        message: NOTIFICATION_MESSAGES.user.deleted,
      });
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      logger.error('Error deleting user:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: NOTIFICATION_MESSAGES.error.generic,
      });
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setShowPasswordReset(true);
  };

  const handleConfirmPasswordReset = async (newPassword: string) => {
    if (!selectedUser) return;

    try {
      await resetPasswordMutation.mutateAsync({
        username: selectedUser.username,
        newPassword,
      });
      showToast({
        type: 'success',
        title: 'Contraseña restablecida',
        message: NOTIFICATION_MESSAGES.user.passwordReset,
      });
      setShowPasswordReset(false);
      setSelectedUser(null);
    } catch (error) {
      logger.error('Error resetting password:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: NOTIFICATION_MESSAGES.error.generic,
      });
    }
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setShowRoleChange(true);
  };

  const handleConfirmRoleChange = async (newRole: 'admin' | 'employee') => {
    if (!selectedUser) return;

    try {
      await changeRoleMutation.mutateAsync({
        username: selectedUser.username,
        role: newRole,
      });
      showToast({
        type: 'success',
        title: 'Rol actualizado',
        message: NOTIFICATION_MESSAGES.user.roleChanged,
      });
      setShowRoleChange(false);
      setSelectedUser(null);
    } catch (error) {
      logger.error('Error changing role:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: NOTIFICATION_MESSAGES.error.generic,
      });
    }
  };

  const handleEnableUser = async (user: User) => {
    try {
      await enableUserMutation.mutateAsync(user.username);
      showToast({
        type: 'success',
        title: 'Usuario habilitado',
        message: NOTIFICATION_MESSAGES.user.enabled,
      });
    } catch (error) {
      logger.error('Error enabling user:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: NOTIFICATION_MESSAGES.error.generic,
      });
    }
  };

  const handleDisableUser = (user: User) => {
    setSelectedUser(user);
    setShowDisableConfirm(true);
  };

  const handleConfirmDisable = async () => {
    if (!selectedUser) return;

    try {
      await disableUserMutation.mutateAsync(selectedUser.username);
      showToast({
        type: 'success',
        title: 'Usuario deshabilitado',
        message: NOTIFICATION_MESSAGES.user.disabled,
      });
      setShowDisableConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      logger.error('Error disabling user:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: NOTIFICATION_MESSAGES.error.generic,
      });
    }
  };

  const handleUserFormSubmit = async (
    data: UserCreateInput | UserUpdateInput
  ) => {
    try {
      if (isEditing && selectedUser) {
        await updateUserMutation.mutateAsync({
          username: selectedUser.username,
          data: data as UserUpdateInput,
        });
        showToast({
          type: 'success',
          title: 'Usuario actualizado',
          message: NOTIFICATION_MESSAGES.user.updated,
        });
      } else {
        await createUserMutation.mutateAsync(data as UserCreateInput);
        showToast({
          type: 'success',
          title: 'Usuario creado',
          message: NOTIFICATION_MESSAGES.user.created,
        });
      }
      setShowUserForm(false);
      setSelectedUser(null);
      setIsEditing(false);
    } catch (error) {
      logger.error('Error saving user:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: NOTIFICATION_MESSAGES.error.generic,
      });
    }
  };

  const handleCloseUserForm = () => {
    setShowUserForm(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleRefresh = useCallback(async () => {
    try {
      await refetchUsers();
      showToast({
        type: 'success',
        title: 'Actualizado',
        message: 'Los usuarios se han actualizado correctamente',
      });
    } catch (error) {
      logger.error('Error refreshing users:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar los usuarios',
      });
    }
  }, [refetchUsers, showToast]);

  const handleSearch = useCallback(() => {
    // Search is handled by filters, this is just a placeholder
    // The actual filtering happens in UserList component
  }, []);

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Gestión de Usuarios
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Administra los usuarios del sistema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton
              onClick={handleRefresh}
              isRefetching={isRefetching}
              variant="secondary"
            />
            <Button
              onClick={handleCreateUser}
              leftIcon={<Plus className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Crear Usuario
            </Button>
          </div>
        </div>

        {/* User List */}
        <UserList
          users={users || []}
          currentUsername={currentUser?.username}
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onResetPassword={handleResetPassword}
          onChangeRole={handleChangeRole}
          onEnable={handleEnableUser}
          onDisable={handleDisableUser}
          isLoading={isLoading}
          error={usersError}
        />

        {/* User Form Modal */}
        <UserForm
          user={selectedUser || undefined}
          isOpen={showUserForm}
          onClose={handleCloseUserForm}
          onSubmit={handleUserFormSubmit}
          isLoading={
            createUserMutation.isPending || updateUserMutation.isPending
          }
        />

        {/* Password Reset Modal */}
        {selectedUser && (
          <PasswordResetModal
            user={selectedUser}
            isOpen={showPasswordReset}
            onClose={() => {
              setShowPasswordReset(false);
              setSelectedUser(null);
            }}
            onSubmit={handleConfirmPasswordReset}
            isLoading={resetPasswordMutation.isPending}
          />
        )}

        {/* Role Change Modal */}
        {selectedUser && (
          <ConfirmDialog
            isOpen={showRoleChange}
            onClose={() => {
              setShowRoleChange(false);
              setSelectedUser(null);
            }}
            onConfirm={() =>
              handleConfirmRoleChange(
                selectedUser.role === 'admin' ? 'employee' : 'admin'
              )
            }
            title="Cambiar Rol de Usuario"
            message={`¿Estás seguro de cambiar el rol de "${selectedUser.username}" a ${
              selectedUser.role === 'admin' ? 'Empleado' : 'Administrador'
            }?`}
            confirmText="Cambiar Rol"
            variant="warning"
            isLoading={changeRoleMutation.isPending}
            icon={<UserCog className="w-6 h-6" />}
          />
        )}

        {/* Delete Confirmation */}
        {selectedUser && (
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setSelectedUser(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Eliminar Usuario"
            message={`¿Estás seguro de que deseas eliminar el usuario "${selectedUser.username}"? Esta acción no se puede deshacer.`}
            confirmText="Eliminar"
            variant="danger"
            isLoading={deleteUserMutation.isPending}
          />
        )}

        {/* Disable Confirmation */}
        {selectedUser && (
          <ConfirmDialog
            isOpen={showDisableConfirm}
            onClose={() => {
              setShowDisableConfirm(false);
              setSelectedUser(null);
            }}
            onConfirm={handleConfirmDisable}
            title="Deshabilitar Usuario"
            message={`¿Estás seguro de que deseas deshabilitar el usuario "${selectedUser.username}"? El usuario no podrá acceder al sistema.`}
            confirmText="Deshabilitar"
            variant="warning"
            isLoading={disableUserMutation.isPending}
          />
        )}
      </div>
    </PageLayout>
  );
};

