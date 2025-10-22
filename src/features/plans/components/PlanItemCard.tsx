import React from 'react'
import { Plan } from '../api/types'
import { formatPrice, formatDuration } from '../utils/planHelpers'

interface PlanItemCardProps {
  plan: Plan
  isSelected: boolean
  onSelect: (plan: Plan) => void
}

export const PlanItemCard: React.FC<PlanItemCardProps> = ({
  plan,
  isSelected,
  onSelect,
}) => (
  <div
    className={`
      p-4 border rounded-lg cursor-pointer transition-all duration-200
      ${isSelected 
        ? 'border-blue-500 bg-blue-50 shadow-md' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }
    `}
    onClick={() => onSelect(plan)}
  >
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-900">{plan.name}</h3>
        {plan.description && (
          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
        )}
      </div>
      <span className="text-xl font-bold text-green-600 ml-4">
        {formatPrice(plan.price)}
      </span>
    </div>
    
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">
        {formatDuration(plan.duration_count, plan.duration_unit)}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onSelect(plan)
        }}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          isSelected
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
      </button>
    </div>
  </div>
)
