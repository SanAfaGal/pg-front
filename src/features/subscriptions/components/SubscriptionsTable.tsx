import React, { memo, useMemo, useState, useCallback } from 'react';
import { Subscription, SubscriptionStatus, SubscriptionFilters } from '../api/types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { SubscriptionStatusBadge } from './SubscriptionList';
import { formatDate } from '../utils/subscriptionHelpers';
import { useMediaQuery } from '../../../shared';
import { useClientsMap } from '../../../features/clients/hooks/useClients';
import { clientHelpers } from '../../../features/clients/utils/clientHelpers';
import { Client } from '../../../features/clients/types';
import { Eye, Search, Filter, X, DollarSign, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  filters: SubscriptionFilters;
  onFiltersChange: (filters: SubscriptionFilters) => void;
  onViewDetails?: (subscription: Subscription) => void;
  onViewClient?: (clientId: string) => void;
  className?: string;
}

/**
 * Subscription Row Component (Desktop)
 */
const SubscriptionRow: React.FC<{
  subscription: Subscription;
  onViewDetails: (subscription: Subscription) => void;
  onViewClient: (clientId: string) => void;
  index: number;
  clientsMap: Map<string, Client>;
}> = ({ subscription, onViewDetails, onViewClient, index, clientsMap }) => {
  // Get client from map or fallback to ID
  const client = clientsMap.get(subscription.client_id);
  const clientName = client 
    ? clientHelpers.formatFullName(client)
    : subscription.client_id.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Status Badge */}
        <div className="flex-shrink-0">
          <SubscriptionStatusBadge status={subscription.status} />
        </div>

        {/* Client Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => onViewClient(subscription.client_id)}
              className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors truncate"
            >
              {clientName}
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span>ID: {subscription.id.slice(0, 8)}</span>
            <span>•</span>
            <span>{formatDate(subscription.start_date)}</span>
            <span>→</span>
            <span>{formatDate(subscription.end_date)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(subscription)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Ver
        </Button>
      </div>
    </motion.div>
  );
};

/**
 * Subscription Card Component (Mobile)
 */
const SubscriptionCard: React.FC<{
  subscription: Subscription;
  onViewDetails: (subscription: Subscription) => void;
  onViewClient: (clientId: string) => void;
  index: number;
  clientsMap: Map<string, Client>;
}> = ({ subscription, onViewDetails, onViewClient, index, clientsMap }) => {
  // Get client from map or fallback to ID
  const client = clientsMap.get(subscription.client_id);
  const clientName = client 
    ? clientHelpers.formatFullName(client)
    : subscription.client_id.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      {/* Header with Status Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => onViewClient(subscription.client_id)}
              className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors truncate"
            >
              {clientName}
            </button>
          </div>
          <div className="text-xs text-gray-500">
            ID: {subscription.id.slice(0, 8)}
          </div>
        </div>
        <SubscriptionStatusBadge status={subscription.status} />
      </div>

      {/* Date Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-xs text-gray-500">Inicio: </span>
          <span className="text-sm font-medium text-gray-900">{formatDate(subscription.start_date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-xs text-gray-500">Fin: </span>
          <span className="text-sm font-medium text-gray-900">{formatDate(subscription.end_date)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(subscription)}
          leftIcon={<Eye className="w-4 h-4" />}
          className="w-full"
        >
          Ver Detalles
        </Button>
      </div>
    </motion.div>
  );
};

export const SubscriptionsTable: React.FC<SubscriptionsTableProps> = memo(({
  subscriptions,
  isLoading = false,
  filters,
  onFiltersChange,
  onViewDetails,
  onViewClient,
  className = '',
}) => {
  const { isMobile } = useMediaQuery();
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique client IDs from subscriptions
  const clientIds = useMemo(() => {
    return subscriptions.map(sub => sub.client_id);
  }, [subscriptions]);

  // Get clients map using the hook
  const { clientsMap } = useClientsMap(clientIds);

  // Filter subscriptions by status and search query (client ID or subscription ID)
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions;
    
    // Apply status filter if specified
    if (filters.status) {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }
    
    // Apply search query filter if specified
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub => {
        const matchesId = sub.id.toLowerCase().includes(query) ||
          sub.client_id.toLowerCase().includes(query);
        
        // Also search by client name if available
        const client = clientsMap.get(sub.client_id);
        const matchesName = client 
          ? clientHelpers.formatFullName(client).toLowerCase().includes(query)
          : false;
        
        return matchesId || matchesName;
      });
    }
    
    return filtered;
  }, [subscriptions, filters.status, searchQuery, clientsMap]);

  const handleStatusFilter = useCallback((status: SubscriptionStatus | 'all') => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? undefined : status,
      offset: 0, // Reset pagination when filtering
    });
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    onFiltersChange({
      limit: filters.limit,
      offset: 0,
    });
    setSearchQuery('');
  }, [filters.limit, onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return !!filters.status || !!searchQuery.trim();
  }, [filters.status, searchQuery]);

  if (isLoading) {
    return (
      <Card className={`p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <p className="text-sm text-gray-500 mt-3">Cargando suscripciones...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID de cliente o suscripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={filters.status === undefined ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filters.status === SubscriptionStatus.ACTIVE ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(SubscriptionStatus.ACTIVE)}
            >
              Activas
            </Button>
            <Button
              variant={filters.status === SubscriptionStatus.PENDING_PAYMENT ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(SubscriptionStatus.PENDING_PAYMENT)}
            >
              Pendientes
            </Button>
            <Button
              variant={filters.status === SubscriptionStatus.EXPIRED ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter(SubscriptionStatus.EXPIRED)}
            >
              Expiradas
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                leftIcon={<X className="w-4 h-4" />}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredSubscriptions.length} de {subscriptions.length} suscripciones
      </div>

      {/* Subscriptions List */}
      {filteredSubscriptions.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500">No se encontraron suscripciones</p>
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className={isMobile ? 'space-y-3 p-4' : 'space-y-1 p-2'}>
            {filteredSubscriptions.map((subscription, index) =>
              isMobile ? (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onViewDetails={onViewDetails || (() => {})}
                  onViewClient={onViewClient || (() => {})}
                  index={index}
                  clientsMap={clientsMap}
                />
              ) : (
                <SubscriptionRow
                  key={subscription.id}
                  subscription={subscription}
                  onViewDetails={onViewDetails || (() => {})}
                  onViewClient={onViewClient || (() => {})}
                  index={index}
                  clientsMap={clientsMap}
                />
              )
            )}
          </div>
        </Card>
      )}
    </div>
  );
});

SubscriptionsTable.displayName = 'SubscriptionsTable';

