import React from 'react'
import { Plan } from '../api/types'
import { formatPrice, formatDuration } from '../utils/planHelpers'
import { Check, ArrowRight } from 'lucide-react'

interface PlanCardProps {
  plan: Plan
  isSelected: boolean
  onSelect: (plan: Plan) => void
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isSelected,
  onSelect,
}) => (
  <div
    className={`
      relative group cursor-pointer transition-all duration-300 ease-out
      ${isSelected 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg transform scale-105' 
        : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-102'
      }
      rounded-xl p-6 min-h-[140px] flex flex-col justify-between
    `}
    onClick={() => onSelect(plan)}
  >
    {/* Selection indicator */}
    {isSelected && (
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
        <Check className="w-4 h-4 text-white" />
      </div>
    )}

    {/* Content */}
    <div className="space-y-3">
      <div>
        <h3 className={`font-bold text-lg leading-tight ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
          {plan.name}
        </h3>
        {plan.description && (
          <p className={`text-sm mt-1 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
            {plan.description}
          </p>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div className={`text-2xl font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
            {formatPrice(plan.price, plan.currency)}
          </div>
          <div className={`text-xs uppercase tracking-wide font-medium ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
            {formatDuration(plan.duration_count, plan.duration_unit)}
          </div>
        </div>
        
        <div className={`
          inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
          ${isSelected 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
          }
        `}>
          Elegir
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  </div>
)
