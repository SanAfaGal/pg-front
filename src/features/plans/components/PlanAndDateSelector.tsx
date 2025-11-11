import React, { useState } from 'react'
import { Plan } from '../api/types'
import { useActivePlans } from '../hooks/useActivePlans'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { AlertTriangle, FileText, RefreshCw, Calendar, ArrowRight } from 'lucide-react'
import { PlanCard } from './PlanCard'

interface PlanAndDateSelectorProps {
  onConfirm: (plan: Plan, startDate: string) => void
  selectedPlanId?: string
  isOpen: boolean
  onClose: () => void
}

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[140px] animate-pulse">
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
    </div>
    <div className="flex items-end justify-between">
      <div className="space-y-1">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
    </div>
  </div>
)

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="text-center py-12 col-span-full">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
      <AlertTriangle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">{message}</p>
    <Button onClick={onRetry} variant="outline" className="inline-flex items-center gap-2">
      <RefreshCw className="w-4 h-4" />
      Reintentar
    </Button>
  </div>
)

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12 col-span-full">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
      <FileText className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin planes disponibles</h3>
    <p className="text-gray-600 max-w-sm mx-auto">{message}</p>
  </div>
)

// Helper function to get current date in Colombian timezone
const getCurrentDateInColombia = () => {
  const now = new Date()
  // Colombia timezone: America/Bogota (UTC-5, no daylight saving time)
  // Use Intl.DateTimeFormat to get date components in Colombia timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  // Format returns YYYY-MM-DD directly (en-CA locale uses ISO format)
  return formatter.format(now)
}

export const PlanAndDateSelector: React.FC<PlanAndDateSelectorProps> = ({
  onConfirm,
  selectedPlanId,
  isOpen,
  onClose,
}) => {
  const { data: plans, isLoading, error, refetch } = useActivePlans()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [startDate, setStartDate] = useState(getCurrentDateInColombia())
  const [step, setStep] = useState<'plan' | 'date'>('plan')

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setStep('date')
  }

  const handleConfirm = () => {
    if (selectedPlan && startDate) {
      onConfirm(selectedPlan, startDate)
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedPlan(null)
    setStartDate(getCurrentDateInColombia())
    setStep('plan')
    onClose()
  }

  const goBackToPlanSelection = () => {
    setStep('plan')
    setSelectedPlan(null)
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nueva Suscripción" size="xl">
      <div className="p-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step === 'plan' ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              1
            </div>
            <div className="w-12 h-0.5 bg-gray-300">
              <div className={`h-full bg-blue-500 transition-all duration-300 ${
                step === 'date' ? 'w-full' : 'w-0'
              }`} />
            </div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {step === 'plan' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecciona tu Plan</h2>
              <p className="text-gray-600">Elige el plan que mejor se adapte a tus necesidades</p>
            </div>

            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {error && (
              <ErrorState
                message="No pudimos cargar los planes disponibles."
                onRetry={() => refetch()}
              />
            )}

            {plans && plans.length === 0 && (
              <EmptyState message="Contacta con el administrador para más información." />
            )}

            {plans && plans.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </>
        )}

        {/* Step 2: Date Selection */}
        {step === 'date' && selectedPlan && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fecha de Inicio</h2>
              <p className="text-gray-600">¿Cuándo quieres comenzar con tu plan?</p>
            </div>

            <div className="max-w-md mx-auto">
              {/* Selected plan summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">{selectedPlan.name}</h3>
                    <p className="text-sm text-blue-700 mt-1">{selectedPlan.description}</p>
                  </div>
                </div>
              </div>

              {/* Date picker */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de inicio
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Puedes seleccionar cualquier fecha para el inicio de la suscripción
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
              <Button variant="outline" onClick={goBackToPlanSelection}>
                Cambiar Plan
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={!startDate}
                className="inline-flex items-center gap-2"
              >
                Confirmar Suscripción
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}

        {/* Cancel button for plan selection step */}
        {step === 'plan' && plans && plans.length > 0 && (
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {plans.length} plan{plans.length !== 1 ? 'es' : ''} disponible{plans.length !== 1 ? 's' : ''}
            </p>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
