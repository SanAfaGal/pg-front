import React from 'react'
import { Plan } from '../api/types'
import { useActivePlans } from '../hooks/useActivePlans'
import { PlanItemCard } from './PlanItemCard'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'

interface PlanSelectorProps {
  onSelect: (plan: Plan) => void
  selectedPlanId?: string
  isOpen: boolean
  onClose: () => void
}

const SkeletonCard = () => (
  <div className="p-4 border border-gray-200 rounded-lg animate-pulse">
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-20 ml-4"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
)

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="text-center py-8">
    <div className="text-red-600 mb-4">
      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <p className="text-gray-600 mb-4">{message}</p>
    <Button onClick={onRetry} variant="outline">
      Reintentar
    </Button>
  </div>
)

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-8">
    <div className="text-gray-400 mb-4">
      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <p className="text-gray-600">{message}</p>
  </div>
)

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  onSelect,
  selectedPlanId,
  isOpen,
  onClose,
}) => {
  const { data: plans, isLoading, error, refetch } = useActivePlans()

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Seleccionar Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {error && (
            <ErrorState 
              message="Error cargando planes"
              onRetry={() => refetch()}
            />
          )}

          {plans && plans.length === 0 && (
            <EmptyState message="No hay planes disponibles" />
          )}

          {plans && plans.length > 0 && (
            <div className="space-y-3">
              {plans.map(plan => (
                <PlanItemCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlanId === plan.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
