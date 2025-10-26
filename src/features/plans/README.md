# Plans Feature

This feature provides plan management functionality for the subscription system.

## Structure

```
src/features/plans/
├── api/
│   ├── planApi.ts              # API functions for fetching plans
│   └── types.ts                # TypeScript interfaces for plans
├── components/
│   ├── PlanAndDateSelector.tsx # Unified modal for plan + date selection
│   ├── PlanSelector.tsx        # Legacy modal for selecting plans only
│   ├── PlanCard.tsx            # Interactive plan card with selection
│   └── PlanItemCard.tsx        # Display-only plan card component
├── hooks/
│   └── useActivePlans.ts       # React Query hook for active plans
├── utils/
│   └── planHelpers.ts          # Utility functions for formatting
└── index.ts                    # Feature exports
```

## API Endpoints

- **GET** `/api/v1/plans/` - Fetch active plans
  - Query params: `is_active=true`, `limit`, `offset`
  - Returns: Array of Plan objects

## Components

### PlanAndDateSelector ⭐ **Recommended**
Unified modal component for selecting both plan and start date in a single flow.

**Props:**
- `onConfirm: (plan: Plan, startDate: string) => void` - Callback when both plan and date are selected
- `selectedPlanId?: string` - ID of currently selected plan
- `isOpen: boolean` - Modal open state
- `onClose: () => void` - Close modal callback

**Features:**
- Two-step wizard interface (Plan → Date)
- Progress indicator
- Responsive grid layout
- No scrolling required
- Automatic modal close on confirmation

### PlanCard
Interactive plan card with selection functionality and modern design.

**Props:**
- `plan: Plan` - Plan object to display
- `isSelected: boolean` - Whether this plan is selected
- `onSelect: (plan: Plan) => void` - Selection callback

### PlanItemCard
Display-only plan card component with multiple variants.

**Props:**
- `plan: Plan` - Plan object to display
- `variant?: 'display' | 'compact'` - Display variant
- `className?: string` - Additional CSS classes

### PlanSelector (Legacy)
Original modal component for selecting plans only. Use `PlanAndDateSelector` for new implementations.

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

## Usage Examples

### Unified Plan and Date Selection (Recommended)

```tsx
import { PlanAndDateSelector } from '@/features/plans'

function SubscriptionForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleConfirm = (plan: Plan, startDate: string) => {
    // Create subscription with selected plan and date
    createSubscription({
      planId: plan.id,
      startDate,
      // ... other fields
    })
  }
  
  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Nueva Suscripción
      </Button>
      
      <PlanAndDateSelector
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  )
}
```

### Display-Only Plan Cards

```tsx
import { PlanItemCard } from '@/features/plans'

function PlanList({ plans }: { plans: Plan[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {plans.map(plan => (
        <PlanItemCard
          key={plan.id}
          plan={plan}
          variant="compact"
        />
      ))}
    </div>
  )
}
```
