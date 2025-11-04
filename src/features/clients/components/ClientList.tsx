import { useState, useMemo, useCallback, memo } from 'react';
import { Search, Plus, Edit2, Eye, Trash2, UserCircle2, Phone, Mail, Calendar, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ClientFormModal } from './ClientFormModal';
import { useToast, logger } from '@/shared';
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

  const { data: clients = [], isLoading: loading, isError } = useClients();
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
      showToast(`${clientHelpers.formatFullName(client)} ha sido inactivado correctamente`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al inactivar cliente';
      showToast(errorMessage, 'error');
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
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona la información de tus clientes
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-powergym-red hover:bg-[#c50202] shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 sm:mr-2" />
          <span className="hidden sm:inline">Nuevo Cliente</span>
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, documento, teléfono o dirección"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Registro
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src=""
                          alt={clientHelpers.formatFullName(client)}
                          size="md"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {clientHelpers.formatFullName(client)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {clientHelpers.calculateAge(client.birth_date)} años
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {client.dni_type}
                        </div>
                        <div className="text-gray-500">{client.dni_number}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </div>
                        {client.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {client.address}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={client.is_active ? 'success' : 'error'}>
                        {client.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(client.created_at)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => onSelectClient?.(client.id)}
                          className="p-2 text-gray-400 hover:text-powergym-blue-medium hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-2 text-gray-400 hover:text-powergym-blue-medium hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {client.is_active && (
                          <button
                            onClick={() => handleDelete(client)}
                            className="p-2 text-gray-400 hover:text-powergym-red hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Inactivar cliente"
                            disabled={deleteClientMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
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
