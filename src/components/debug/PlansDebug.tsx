import React from 'react';
import { useActivePlans } from '../../features/plans/hooks/useActivePlans';
import { PlanSelector } from '../../features/plans/components/PlanSelector';
import { Plan } from '../../features/plans/api/types';

export const PlansDebug: React.FC = () => {
  const { data: plans, isLoading, error, refetch } = useActivePlans();
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null);

  // Debug logs
  React.useEffect(() => {
    console.log('PlansDebug - isLoading:', isLoading);
    console.log('PlansDebug - error:', error);
    console.log('PlansDebug - plans:', plans);
  }, [isLoading, error, plans]);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsSelectorOpen(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug: Planes</h1>
      
      {/* API Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Estado de la API</h2>
        <div className="space-y-2">
          <p><strong>Loading:</strong> {isLoading ? 'Sí' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'Ninguno'}</p>
          <p><strong>Planes cargados:</strong> {plans?.length || 0}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refetch
        </button>
      </div>

      {/* Plans List */}
      {plans && plans.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Planes Disponibles</h2>
          <div className="space-y-2">
            {plans.map(plan => (
              <div key={plan.id} className="p-3 border rounded-lg">
                <p><strong>ID:</strong> {plan.id}</p>
                <p><strong>Nombre:</strong> {plan.name}</p>
                <p><strong>Precio:</strong> {plan.price} {plan.currency}</p>
                <p><strong>Duración:</strong> {plan.duration_count} {plan.duration_unit}</p>
                <p><strong>Activo:</strong> {plan.is_active ? 'Sí' : 'No'}</p>
                {plan.description && <p><strong>Descripción:</strong> {plan.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Selector Test */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Test Plan Selector</h2>
        <button
          onClick={() => setIsSelectorOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Abrir Selector de Planes
        </button>
        
        {selectedPlan && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p><strong>Plan Seleccionado:</strong> {selectedPlan.name}</p>
            <p><strong>Precio:</strong> {selectedPlan.price} {selectedPlan.currency}</p>
          </div>
        )}
      </div>

      {/* Plan Selector Modal */}
      <PlanSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleSelectPlan}
        selectedPlanId={selectedPlan?.id}
      />
    </div>
  );
};
