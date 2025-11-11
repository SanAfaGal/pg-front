import React from 'react';
import { User } from '../api/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Edit, Trash2, Key, UserCog, Shield, ShieldOff, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';

interface UserTableProps {
  users: User[];
  currentUsername?: string;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onChangeRole?: (user: User) => void;
  onEnable?: (user: User) => void;
  onDisable?: (user: User) => void;
}

const getRoleLabel = (role: string): string => {
  return role === 'admin' ? 'Administrador' : 'Empleado';
};

const getRoleVariant = (role: string): 'primary' | 'default' => {
  return role === 'admin' ? 'primary' : 'default';
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUsername,
  onEdit,
  onDelete,
  onResetPassword,
  onChangeRole,
  onEnable,
  onDisable,
}) => {
  if (users.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            No hay usuarios disponibles
          </p>
          <p className="text-sm text-gray-500">
            Crea tu primer usuario para comenzar
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map((user, index) => {
                const isCurrentUser = user.username === currentUsername;
                return (
                  <motion.tr
                    key={user.username}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.username}
                          </p>
                          {isCurrentUser && (
                            <p className="text-xs text-blue-600 mt-0.5">(Tú)</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {user.full_name || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {user.email || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getRoleVariant(user.role)} size="sm">
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.disabled ? 'error' : 'success'}
                        size="sm"
                      >
                        {user.disabled ? 'Deshabilitado' : 'Activo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(user)}
                            title="Editar"
                            className="p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onResetPassword && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onResetPassword(user)}
                            title="Resetear Contraseña"
                            className="p-2"
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                        )}
                        {onChangeRole && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onChangeRole(user)}
                            title="Cambiar Rol"
                            className="p-2"
                          >
                            <UserCog className="w-4 h-4" />
                          </Button>
                        )}
                        {user.disabled && onEnable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEnable(user)}
                            title="Habilitar"
                            className="p-2 text-green-600 hover:bg-green-50"
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                        )}
                        {!user.disabled && onDisable && !isCurrentUser && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDisable(user)}
                            title="Deshabilitar"
                            className="p-2 text-yellow-600 hover:bg-yellow-50"
                          >
                            <ShieldOff className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && !isCurrentUser && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(user)}
                            className="text-red-600 hover:bg-red-50 p-2"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {users.map((user, index) => {
          const isCurrentUser = user.username === currentUsername;
          return (
            <motion.div
              key={user.username}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {user.username}
                        </p>
                        {isCurrentUser && (
                          <Badge variant="info" size="sm">Tú</Badge>
                        )}
                      </div>
                      {user.full_name && (
                        <p className="text-sm text-gray-600 mt-0.5">
                          {user.full_name}
                        </p>
                      )}
                      {user.email && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge variant={getRoleVariant(user.role)} size="sm">
                      {getRoleLabel(user.role)}
                    </Badge>
                    <Badge
                      variant={user.disabled ? 'error' : 'success'}
                      size="sm"
                    >
                      {user.disabled ? 'Deshabilitado' : 'Activo'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(user)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                  {onResetPassword && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onResetPassword(user)}
                      className="flex-1"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Contraseña
                    </Button>
                  )}
                  {onDelete && !isCurrentUser && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(user)}
                      className="text-red-600 hover:bg-red-50 flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

