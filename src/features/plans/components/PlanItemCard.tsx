import React from 'react'
import { Plan } from '../api/types'
import { formatPrice, formatDuration } from '../utils/planHelpers'

interface PlanItemCardProps {
  plan: Plan
  variant?: 'display' | 'compact'
  className?: string
}

export const PlanItemCard: React.FC<PlanItemCardProps> = ({
  plan,
  variant = 'display',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{plan.name}</h4>
            <p className="text-sm text-gray-600">{formatDuration(plan.duration_count, plan.duration_unit)}</p>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(plan.price)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
          {plan.description && (
            <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(plan.price)}
            </div>
            <div className="text-xs uppercase tracking-wide font-medium text-gray-500">
              {formatDuration(plan.duration_count, plan.duration_unit)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
