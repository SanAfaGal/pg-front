import React from 'react'
import { Plan } from '../api/types'
import { useActivePlans } from '../hooks/useActivePlans'
import { PlanCard } from './PlanCard'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { AlertTriangle, FileText, RefreshCw } from 'lucide-react'

interface PlanSelectorProps {
  onSelect: (plan: Plan) => void
  selectedPlanId?: string
  isOpen: boolean
  onClose: () => void
}

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[160px] animate-pulse">
    <div className="space-y-2 mb-4">
      <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
    </div>
    <div className="flex items-end justify-between mt-4">
      <div className="space-y-1">
        <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
        <div className="h-3 bg-gray-200 rounded-lg w-16"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>
  </div>
)

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
      <AlertTriangle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar planes</h3>
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">{message}</p>
    <Button onClick={onRetry} variant="outline" className="inline-flex items-center gap-2">
      <RefreshCw className="w-4 h-4" />
      Reintentar
    </Button>
  </div>
)

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
      <FileText className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay planes disponibles</h3>
    <p className="text-gray-600 max-w-sm mx-auto">{message}</p>
  </div>
)

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  onSelect,
  selectedPlanId,
  isOpen,
  onClose,
}) => {
  const { data: plans, isLoading, error, refetch } = useActivePlans()

  const handlePlanSelect = (plan: Plan) => {
    onSelect(plan)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar Plan" size="xl">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Elige tu plan perfecto</h2>
          <p className="text-gray-600">Selecciona el plan que mejor se adapte a tus necesidades</p>
        </div>

        {/* Content */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <ErrorState
            message="No pudimos cargar los planes disponibles. Por favor, intenta nuevamente."
            onRetry={() => refetch()}
          />
        )}

        {plans && plans.length === 0 && (
          <EmptyState message="Actualmente no hay planes disponibles. Contacta con el administrador." />
        )}

        {plans && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                onSelect={handlePlanSelect}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {plans && plans.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {plans.length} plan{plans.length !== 1 ? 'es' : ''} disponible{plans.length !== 1 ? 's' : ''}
            </p>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
