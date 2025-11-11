import React, { useState } from 'react';
import { User } from '../api/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Edit, Trash2, Key, UserCog, Shield, ShieldOff, MoreVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserCardsProps {
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

export const UserCards: React.FC<UserCardsProps> = ({
  users,
  currentUsername,
  onEdit,
  onDelete,
  onResetPassword,
  onChangeRole,
  onEnable,
  onDisable,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

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
    <div className="space-y-3">
      {users.map((user, index) => {
        const isCurrentUser = user.username === currentUsername;
        const isMenuOpen = openMenu === user.username;

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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {user.username}
                      </p>
                      {isCurrentUser && (
                        <Badge variant="info" size="sm">Tú</Badge>
                      )}
                    </div>
                    {user.full_name && (
                      <p className="text-sm text-gray-600 mb-1">
                        {user.full_name}
                      </p>
                    )}
                    {user.email && (
                      <p className="text-xs text-gray-500">
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

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
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
                    onClick={() => {
                      onResetPassword(user);
                      setOpenMenu(null);
                    }}
                    className="flex-1"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Contraseña
                  </Button>
                )}
                <div className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setOpenMenu(isMenuOpen ? null : user.username)}
                    className="p-2"
                  >
                    {isMenuOpen ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <MoreVertical className="w-4 h-4" />
                    )}
                  </Button>
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
                      >
                        {onChangeRole && (
                          <button
                            onClick={() => {
                              onChangeRole(user);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <UserCog className="w-4 h-4" />
                            Cambiar Rol
                          </button>
                        )}
                        {user.disabled && onEnable && (
                          <button
                            onClick={() => {
                              onEnable(user);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                          >
                            <Shield className="w-4 h-4" />
                            Habilitar
                          </button>
                        )}
                        {!user.disabled && onDisable && !isCurrentUser && (
                          <button
                            onClick={() => {
                              onDisable(user);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-yellow-700 hover:bg-yellow-50 flex items-center gap-2"
                          >
                            <ShieldOff className="w-4 h-4" />
                            Deshabilitar
                          </button>
                        )}
                        {onDelete && !isCurrentUser && (
                          <button
                            onClick={() => {
                              onDelete(user);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

