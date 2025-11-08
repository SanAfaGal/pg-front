import { useState, useMemo, useCallback, memo } from 'react';
import { Search, Plus, Edit2, Eye, Trash2, UserCircle2, Phone, Mail, Calendar, Filter, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ClientFormModal } from './ClientFormModal';
import { ClientCards } from './ClientCards';
import { useToast, logger, useMediaQuery } from '@/shared';
import { useClients, useDeleteClient, clientHelpers, type Client } from '../..';

interface ClientListProps {
  onSelectClient?: (clientId: string) => void;
}

/**
 * Optimized client list component with search and filtering capabilities
 * 
 * @param onSelectClient - Optional callback when a client is selected
 */
export const ClientList = memo(({ onSelectClient }: ClientListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { showToast } = useToast();
  const { isDesktop } = useMediaQuery();

  const { data: clients = [], isLoading: loading, isError, isRefetching, refetch } = useClients();
  const deleteClientMutation = useDeleteClient();

  const handleSearch = useCallback(() => {
    setSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleEdit = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (client: Client) => {
    if (!confirm(`¿Está seguro de que desea inactivar al cliente ${clientHelpers.formatFullName(client)}?\n\nEl cliente será marcado como inactivo y no aparecerá en la lista de clientes activos.`)) {
      return;
    }

    try {
      await deleteClientMutation.mutateAsync(client.id);
      showToast({
        type: 'success',
        title: 'Éxito',
        message: `${clientHelpers.formatFullName(client)} ha sido inactivado correctamente`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al inactivar cliente';
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
      logger.error('Error deleting client:', error);
    }
  }, [deleteClientMutation, showToast]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedClient(null);
  }, []);

  const handleClientSaved = () => {
    handleModalClose();
  };

  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
      showToast({
        type: 'success',
        title: 'Actualizado',
        message: 'La lista de clientes se ha actualizado correctamente',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar la lista de clientes',
      });
    }
  }, [refetch, showToast]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = !searchTerm ||
        clientHelpers.formatFullName(client).toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.dni_number.includes(searchTerm) ||
        client.phone.includes(searchTerm) ||
        client.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesActiveFilter = activeFilter === undefined || client.is_active === activeFilter;

      return matchesSearch && matchesActiveFilter;
    });
  }, [clients, searchTerm, activeFilter]);

  if (isError) {
    return (
      <div className="space-y-6 px-4 py-6 lg:px-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 font-medium">Error al cargar clientes</p>
          <p className="text-red-600 text-sm mt-2">Por favor, verifica tu conexión e intenta nuevamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona la información de tus clientes
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="p-2 min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
            title="Actualizar lista"
            aria-label="Actualizar lista"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefetching ? 'animate-spin' : ''}`}
            />
          </button>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="bg-powergym-red hover:bg-[#c50202] shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, documento, teléfono o dirección"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-8 sm:pl-10 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <Filter className="w-5 h-5 text-gray-400 self-center mr-1" />
          <Button
            variant={activeFilter === undefined ? 'primary' : 'outline'}
            onClick={() => setActiveFilter(undefined)}
            size="sm"
            className={activeFilter === undefined ? 'bg-powergym-blue-medium hover:bg-powergym-blue-dark' : ''}
          >
            Todos
          </Button>
          <Button
            variant={activeFilter === true ? 'primary' : 'outline'}
            onClick={() => setActiveFilter(true)}
            size="sm"
            className={activeFilter === true ? 'bg-green-600 hover:bg-green-700 shadow-sm' : ''}
          >
            Activos
          </Button>
          <Button
            variant={activeFilter === false ? 'primary' : 'outline'}
            onClick={() => setActiveFilter(false)}
            size="sm"
            className={activeFilter === false ? 'bg-powergym-red hover:bg-red-700 shadow-sm' : ''}
          >
            Inactivos
          </Button>
        </div>

        {loading ? (
          isDesktop ? (
            // Skeleton para tabla (desktop)
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Skeleton para cards (móvil/tablet)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 p-4 sm:p-5 lg:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-5 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-gray-100 pt-3 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : filteredClients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <UserCircle2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || activeFilter !== undefined
                ? 'No se encontraron clientes'
                : 'No hay clientes registrados'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || activeFilter !== undefined
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer cliente'}
            </p>
          </motion.div>
        ) : isDesktop ? (
          // Vista de tabla para desktop
          <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    Documento
                  </th>
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Contacto
                  </th>
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Registro
                  </th>
                  <th className="text-right py-3 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                {filteredClients.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                    className="border-b border-gray-50 hover:bg-powergym-cream/30 transition-all duration-200 group"
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar
                          src=""
                          alt={clientHelpers.formatFullName(client)}
                          size="md"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {clientHelpers.formatFullName(client)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {clientHelpers.calculateAge(client.birth_date)} años
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden mt-1">
                            {client.dni_type}: {client.dni_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {client.dni_type}
                        </div>
                        <div className="text-gray-500">{client.dni_number}</div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                          {client.phone}
                        </div>
                        {client.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="truncate max-w-[200px]">{client.address}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <Badge variant={client.is_active ? 'success' : 'error'}>
                        {client.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatDate(client.created_at)}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => onSelectClient?.(client.id)}
                          className="p-2 sm:p-2 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-400 hover:text-powergym-blue-medium hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Ver detalles"
                          aria-label="Ver detalles"
                        >
                          <Eye className="w-4 h-4 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-2 sm:p-2 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-400 hover:text-powergym-blue-medium hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Editar"
                          aria-label="Editar"
                        >
                          <Edit2 className="w-4 h-4 sm:w-4 sm:h-4" />
                        </button>
                        {client.is_active && (
                          <button
                            onClick={() => handleDelete(client)}
                            className="p-2 sm:p-2 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-400 hover:text-powergym-red hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Inactivar cliente"
                            aria-label="Inactivar cliente"
                            disabled={deleteClientMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          // Vista de cards para móvil/tablet
          <ClientCards
            clients={filteredClients}
            onView={onSelectClient}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteClientMutation.isPending}
          />
        )}
      </div>

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        client={selectedClient}
        onSaved={handleClientSaved}
      />
    </div>
  );
});

ClientList.displayName = 'ClientList';
