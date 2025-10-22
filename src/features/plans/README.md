# Plans Feature

This feature provides plan management functionality for the subscription system.

## Structure

```
src/features/plans/
├── api/
│   ├── planApi.ts          # API functions for fetching plans
│   └── types.ts            # TypeScript interfaces for plans
├── components/
│   ├── PlanSelector.tsx    # Modal for selecting plans
│   └── PlanItemCard.tsx    # Individual plan card component
├── hooks/
│   └── useActivePlans.ts   # React Query hook for active plans
├── utils/
│   └── planHelpers.ts      # Utility functions for formatting
└── index.ts                # Feature exports
```

## API Endpoints

- **GET** `/api/v1/plans/` - Fetch active plans
  - Query params: `is_active=true`, `limit`, `offset`
  - Returns: Array of Plan objects

## Components

### PlanSelector
Modal component for selecting a plan from available active plans.

**Props:**
- `onSelect: (plan: Plan) => void` - Callback when plan is selected
- `selectedPlanId?: string` - ID of currently selected plan
- `isOpen: boolean` - Modal open state
- `onClose: () => void` - Close modal callback

### PlanItemCard
Individual plan display card within the selector.

**Props:**
- `plan: Plan` - Plan object to display
- `isSelected: boolean` - Whether this plan is selected
- `onSelect: (plan: Plan) => void` - Selection callback

## Hooks

### useActivePlans
React Query hook for fetching active plans with caching.

**Features:**
- 5-minute cache duration
- Automatic retry on failure (3 attempts)
- Loading, error, and success states

## Utils

### formatPrice(price: string | number): string
Formats price in Colombian Pesos (COP) with proper currency formatting.

### formatDuration(count: number, unit: DurationType): string
Formats duration in a human-readable format (e.g., "1 mes", "3 meses").

## Integration

The PlanSelector is integrated into the SubscriptionForm component:

1. User clicks "Seleccionar Plan" button
2. PlanSelector modal opens with active plans
3. User selects a plan
4. Modal closes and selected plan is displayed
5. Plan ID is used when creating subscription

## Usage Example

```tsx
import { PlanSelector, useActivePlans } from '@/features/plans'

function MyComponent() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
    setIsOpen(false)
  }
  
  return (
    <PlanSelector
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSelect={handleSelectPlan}
      selectedPlanId={selectedPlan?.id}
    />
  )
}
```
