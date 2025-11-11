import React, { useMemo } from 'react';
import { User, UserFilters as UserFiltersType } from '../api/types';
import { UserTable } from './UserTable';
import { UserCards } from './UserCards';
import { UserFilters } from './UserFilters';
import { Card } from '../../../components/ui/Card';
import { Shield } from 'lucide-react';
import { useMediaQuery } from '../../../shared';

interface UserListProps {
  users: User[];
  currentUsername?: string;
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
  onSearch: () => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onChangeRole?: (user: User) => void;
  onEnable?: (user: User) => void;
  onDisable?: (user: User) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  currentUsername,
  filters,
  onFiltersChange,
  onSearch,
  onEdit,
  onDelete,
  onResetPassword,
  onChangeRole,
  onEnable,
  onDisable,
  isLoading = false,
  error,
}) => {
  const { isDesktop } = useMediaQuery();

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.full_name?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by role
    if (filters.role && filters.role !== 'all') {
      result = result.filter((user) => user.role === filters.role);
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      const isDisabled = filters.status === 'disabled';
      result = result.filter((user) => user.disabled === isDisabled);
    }

    return result;
  }, [users, filters]);

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error al cargar usuarios
            </h3>
            <p className="text-sm text-red-700 mb-4">
              {error instanceof Error
                ? error.message
                : 'Ocurrió un error inesperado'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <UserFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        onSearch={onSearch}
      />

      {/* Content */}
      {isLoading ? (
        <Card className="p-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-600">Cargando usuarios...</p>
            </div>
          </div>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {filters.search || filters.role !== 'all' || filters.status !== 'all'
                ? 'No se encontraron usuarios'
                : 'No hay usuarios registrados'}
            </p>
            <p className="text-sm text-gray-500">
              {filters.search || filters.role !== 'all' || filters.status !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer usuario al sistema'}
            </p>
          </div>
        </Card>
      ) : isDesktop ? (
        <UserTable
          users={filteredUsers}
          currentUsername={currentUsername}
          onEdit={onEdit}
          onDelete={onDelete}
          onResetPassword={onResetPassword}
          onChangeRole={onChangeRole}
          onEnable={onEnable}
          onDisable={onDisable}
        />
      ) : (
        <UserCards
          users={filteredUsers}
          currentUsername={currentUsername}
          onEdit={onEdit}
          onDelete={onDelete}
          onResetPassword={onResetPassword}
          onChangeRole={onChangeRole}
          onEnable={onEnable}
          onDisable={onDisable}
        />
      )}
    </div>
  );
};

