import React, { useState, useCallback, useMemo } from 'react';
import {
  usePlans,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  useSearchPlans,
  planKeys,
} from '../hooks/usePlans';
import { Plan } from '../api/types';
import { PlanCreateInput } from '../api/planApi';
import { PlanTable } from '../components/PlanTable';
import { PlanForm } from '../components/PlanForm';
import { PlanFilters } from '../components/PlanFilters';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { PageLayout } from '../../../components/ui/PageLayout';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { RefreshButton } from '../../../components/ui/RefreshButton';
import { useToast, logger } from '../../../shared';
import { useIsAdmin } from '../../subscriptions/hooks/useSubscriptionPermissions';
import { Plus, AlertCircle, FileText } from 'lucide-react';
import { NOTIFICATION_MESSAGES } from '../constants/planConstants';

export const PlansPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [isSearching, setIsSearching] = useState(false);

  const isAdmin = useIsAdmin();
  const { showToast } = useToast();

  // Convert filter to boolean or undefined - memoized to avoid recalculation
  const isActiveFilterValue = useMemo(
    () =>
      isActiveFilter === 'all'
        ? undefined
        : isActiveFilter === 'active'
          ? true
          : false,
    [isActiveFilter]
  );

  // Query filters - memoized to avoid unnecessary refetches
  const plansFilters = useMemo(
    () => ({
      is_active: isActiveFilterValue,
      limit: 100,
      offset: 0,
    }),
    [isActiveFilterValue]
  );

  // Queries - enabled by default to load data on page entry
  const {
    data: plans,
    isLoading: plansLoading,
    error: plansError,
    isRefetching: isPlansRefetching,
    refetch: refetchPlans,
  } = usePlans(plansFilters, !isSearching);

  const {
    data: searchResults,
    isLoading: searchLoading,
    isRefetching: isSearchRefetching,
  } = useSearchPlans(searchTerm, 50, isSearching && !!searchTerm);

  // Mutations
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const deletePlanMutation = useDeletePlan();

  // Determine which data to show - memoized to avoid recalculation
  const displayPlans = useMemo(() => {
    if (isSearching && searchTerm) {
      return searchResults || [];
    }
    return plans || [];
  }, [isSearching, searchTerm, searchResults, plans]);

  const isLoading = plansLoading || searchLoading;
  const isRefetching = isPlansRefetching || isSearchRefetching;

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
                  Solo los administradores pueden gestionar planes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Handlers
  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsEditing(false);
    setShowPlanForm(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditing(true);
    setShowPlanForm(true);
  };

  const handleDeletePlan = async (plan: Plan) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el plan "${plan.name}"?`
      )
    ) {
      try {
        await deletePlanMutation.mutateAsync(plan.id);
        showToast({
          type: 'success',
          title: 'Plan eliminado',
          message: NOTIFICATION_MESSAGES.plan.deleted,
        });
      } catch (error) {
        logger.error('Error deleting plan:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: NOTIFICATION_MESSAGES.error.generic,
        });
      }
    }
  };

  const handlePlanFormSubmit = async (data: PlanCreateInput) => {
    try {
      if (isEditing && selectedPlan) {
        await updatePlanMutation.mutateAsync({
          id: selectedPlan.id,
          data,
        });
        showToast({
          type: 'success',
          title: 'Plan actualizado',
          message: NOTIFICATION_MESSAGES.plan.updated,
        });
      } else {
        await createPlanMutation.mutateAsync(data);
        showToast({
          type: 'success',
          title: 'Plan creado',
          message: NOTIFICATION_MESSAGES.plan.created,
        });
      }
      setShowPlanForm(false);
      setSelectedPlan(null);
      setIsEditing(false);
    } catch (error) {
      logger.error('Error saving plan:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: NOTIFICATION_MESSAGES.error.generic,
      });
    }
  };

  const handleClosePlanForm = () => {
    setShowPlanForm(false);
    setSelectedPlan(null);
    setIsEditing(false);
  };

  const handleRefresh = useCallback(async () => {
    try {
      setIsSearching(false);
      setSearchTerm('');
      await refetchPlans();
      showToast({
        type: 'success',
        title: 'Actualizado',
        message: 'Los planes se han actualizado correctamente',
      });
    } catch (error) {
      logger.error('Error refreshing plans:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar los planes',
      });
    }
  }, [refetchPlans, showToast]);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setIsSearching(false);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Gestión de Planes
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Administra los planes de suscripción disponibles
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton
              onClick={handleRefresh}
              isRefetching={isRefetching}
              variant="secondary"
            />
            <Button
              onClick={handleCreatePlan}
              leftIcon={<Plus className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Crear Plan
            </Button>
          </div>
        </div>

        {/* Filters */}
        <PlanFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          isActiveFilter={isActiveFilter}
          onIsActiveFilterChange={setIsActiveFilter}
        />

        {/* Content */}
        {isLoading ? (
          <Card className="p-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          </Card>
        ) : plansError ? (
          <Card className="p-6 border-red-200 bg-red-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error al cargar planes
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  {plansError instanceof Error
                    ? plansError.message
                    : 'Ocurrió un error inesperado'}
                </p>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <PlanTable
            plans={displayPlans}
            onEdit={handleEditPlan}
            onDelete={handleDeletePlan}
          />
        )}

        {/* Plan Form Modal */}
        <PlanForm
          plan={selectedPlan || undefined}
          isOpen={showPlanForm}
          onClose={handleClosePlanForm}
          onSubmit={handlePlanFormSubmit}
          isLoading={
            createPlanMutation.isPending || updatePlanMutation.isPending
          }
        />
      </div>
    </PageLayout>
  );
};

