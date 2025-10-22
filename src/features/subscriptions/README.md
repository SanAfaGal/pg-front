# Subscriptions API Module

A comprehensive React module for managing gym subscriptions and payments using React Query for state management and caching.

## 📁 Project Structure

```
src/features/subscriptions/
├── api/
│   ├── subscriptionApi.ts      # Subscription API functions
│   ├── paymentApi.ts           # Payment API functions
│   └── types.ts                # TypeScript interfaces
├── hooks/
│   ├── useSubscriptions.ts     # Subscription React Query hooks
│   └── usePayments.ts          # Payment React Query hooks
├── components/
│   ├── SubscriptionList.tsx    # List of subscriptions
│   ├── SubscriptionDetail.tsx  # Detailed subscription view
│   ├── SubscriptionForm.tsx    # Create/edit subscription form
│   ├── PaymentForm.tsx         # Payment registration form
│   ├── PaymentHistory.tsx      # Payment history display
│   ├── SubscriptionStatus.tsx  # Status badge component
│   └── SubscriptionsTab.tsx   # Complete tab integration
├── constants/
│   └── subscriptionConstants.ts # Configuration constants
├── utils/
│   ├── subscriptionHelpers.ts  # Subscription utility functions
│   └── paymentHelpers.ts       # Payment utility functions
└── index.ts                    # Module exports
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @tanstack/react-query react-hook-form @hookform/resolvers/zod zod date-fns
```

### 2. Setup API Client

Configure your API client with authentication:

```typescript
import { setAuthTokens } from './shared/api/apiClient';

// Set authentication tokens
setAuthTokens(accessToken, refreshToken);
```

### 3. Use the Subscriptions Tab

```typescript
import { SubscriptionsTab } from './features/subscriptions/components/SubscriptionsTab';

function ClientDetailPage({ clientId, clientName }) {
  const plans = [
    {
      id: 'plan-1',
      name: 'Plan Básico',
      description: 'Acceso básico al gimnasio',
      price: '50000',
      duration_days: 30,
      is_active: true,
    },
    // ... more plans
  ];

  return (
    <SubscriptionsTab
      clientId={clientId}
      clientName={clientName}
      plans={plans}
    />
  );
}
```

## 🔧 API Integration

### Subscription Endpoints

- **POST** `/api/v1/clients/{client_id}/subscriptions/` - Create subscription
- **GET** `/api/v1/clients/{client_id}/subscriptions/` - List subscriptions
- **GET** `/api/v1/clients/{client_id}/subscriptions/active` - Get active subscription
- **POST** `/api/v1/clients/{client_id}/subscriptions/{subscription_id}/renew` - Renew subscription
- **PATCH** `/api/v1/clients/{client_id}/subscriptions/{subscription_id}/cancel` - Cancel subscription

### Payment Endpoints

- **POST** `/api/v1/subscriptions/{subscription_id}/payments` - Create payment
- **GET** `/api/v1/subscriptions/{subscription_id}/payments` - List payments
- **GET** `/api/v1/subscriptions/{subscription_id}/payments/stats` - Payment statistics

## 🎣 React Query Hooks

### Subscription Hooks

```typescript
import {
  useSubscriptions,
  useActiveSubscription,
  useCreateSubscription,
  useRenewSubscription,
  useCancelSubscription,
} from './features/subscriptions';

// Get all subscriptions for a client
const { data: subscriptions, isLoading } = useSubscriptions(clientId);

// Get active subscription
const { data: activeSubscription } = useActiveSubscription(clientId);

// Create subscription mutation
const createSubscription = useCreateSubscription();
await createSubscription.mutateAsync({
  clientId,
  data: { plan_id: 'plan-1', start_date: '2024-01-01' }
});
```

### Payment Hooks

```typescript
import {
  usePayments,
  usePaymentStats,
  useCreatePayment,
} from './features/subscriptions';

// Get payments for a subscription
const { data: payments } = usePayments(subscriptionId);

// Get payment statistics
const { data: stats } = usePaymentStats(subscriptionId);

// Create payment mutation
const createPayment = useCreatePayment();
await createPayment.mutateAsync({
  subscriptionId,
  data: { amount: '50000', payment_method: 'cash' }
});
```

## 🧩 Individual Components

### SubscriptionList

```typescript
import { SubscriptionList } from './features/subscriptions';

<SubscriptionList
  subscriptions={subscriptions}
  onRenew={handleRenew}
  onCancel={handleCancel}
  onViewDetails={handleViewDetails}
  isLoading={isLoading}
  error={error}
/>
```

### SubscriptionForm

```typescript
import { SubscriptionForm } from './features/subscriptions';

<SubscriptionForm
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={handleSuccess}
  clientId={clientId}
  plans={availablePlans}
/>
```

### PaymentForm

```typescript
import { PaymentForm } from './features/subscriptions';

<PaymentForm
  isOpen={isPaymentModalOpen}
  onClose={() => setIsPaymentModalOpen(false)}
  onSuccess={handlePaymentSuccess}
  subscription={selectedSubscription}
  maxAmount={maxPaymentAmount}
/>
```

## 🛠️ Utility Functions

### Subscription Helpers

```typescript
import {
  formatDate,
  isSubscriptionActive,
  getDaysRemaining,
  canRenewSubscription,
  canCancelSubscription,
  getSubscriptionProgress,
} from './features/subscriptions';

// Format dates
const formattedDate = formatDate(subscription.start_date);

// Check subscription status
const isActive = isSubscriptionActive(subscription);
const daysLeft = getDaysRemaining(subscription);

// Check permissions
const canRenew = canRenewSubscription(subscription);
const canCancel = canCancelSubscription(subscription);
```

### Payment Helpers

```typescript
import {
  formatCurrency,
  formatPaymentDate,
  calculateTotalPayments,
  validatePaymentAmount,
} from './features/subscriptions';

// Format currency
const formattedAmount = formatCurrency('50000'); // $50,000.00

// Calculate totals
const totalPaid = calculateTotalPayments(payments);

// Validate amounts
const validation = validatePaymentAmount('50000', 100000);
if (!validation.isValid) {
  console.error(validation.error);
}
```

## 🎨 Styling and Theming

The components use Tailwind CSS classes and are designed to be customizable:

```typescript
// Custom styling
<SubscriptionCard className="custom-subscription-card" />
<PaymentForm className="custom-payment-form" />
```

## 🔒 Error Handling

The module includes comprehensive error handling:

```typescript
// API errors are automatically handled
const { error } = useSubscriptions(clientId);

if (error) {
  console.error('Subscription error:', error.detail);
}

// Form validation errors
const { formState: { errors } } = useForm();
if (errors.amount) {
  console.error('Amount error:', errors.amount.message);
}
```

## 📊 State Management

React Query handles all state management with:

- **Automatic caching** with configurable stale times
- **Optimistic updates** for better UX
- **Automatic refetching** on window focus
- **Background updates** for fresh data
- **Query invalidation** after mutations

## 🔄 Query Invalidation Strategy

The module automatically invalidates related queries after mutations:

- Creating subscription → Invalidates subscription list and active subscription
- Creating payment → Invalidates payments, stats, and subscription details
- Canceling subscription → Invalidates subscription list and details
- Renewing subscription → Invalidates subscription list and active subscription

## 🧪 Testing

The module is designed to be easily testable:

```typescript
// Mock API responses
const mockSubscriptions = [
  {
    id: 'sub-1',
    client_id: 'client-1',
    plan_id: 'plan-1',
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    status: 'active',
  },
];

// Test components with mock data
render(<SubscriptionList subscriptions={mockSubscriptions} />);
```

## 📝 TypeScript Support

Full TypeScript support with strict typing:

```typescript
import { Subscription, Payment, SubscriptionStatus, PaymentMethod } from './features/subscriptions';

const subscription: Subscription = {
  id: 'sub-1',
  client_id: 'client-1',
  plan_id: 'plan-1',
  start_date: '2024-01-01',
  end_date: '2024-01-31',
  status: SubscriptionStatus.ACTIVE,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};
```

## 🚀 Performance Optimizations

- **Lazy loading** of components
- **Memoization** of expensive calculations
- **Optimistic updates** for immediate feedback
- **Efficient query keys** for precise cache management
- **Background refetching** for fresh data

## 🔧 Configuration

Configure the module behavior:

```typescript
// Query stale times
const QUERY_STALE_TIMES = {
  subscriptions: 5 * 60 * 1000, // 5 minutes
  payments: 5 * 60 * 1000, // 5 minutes
  stats: 2 * 60 * 1000, // 2 minutes
};

// Retry configuration
const RETRY_CONFIG = {
  retries: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};
```

## 📱 Responsive Design

All components are fully responsive and work on:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Best Practices

1. **Always handle loading states** in your UI
2. **Provide user feedback** for all actions
3. **Validate data** before API calls
4. **Use optimistic updates** for better UX
5. **Handle errors gracefully** with user-friendly messages
6. **Keep components focused** on single responsibilities
7. **Use TypeScript** for type safety
8. **Test edge cases** and error scenarios

## 🔗 Integration Examples

### With Existing Client Management

```typescript
// In your existing client detail page
import { SubscriptionsTab } from './features/subscriptions';

function ClientDetailPage({ clientId, clientName }) {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="info">Información</TabsTrigger>
        <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
        <TabsTrigger value="attendance">Asistencias</TabsTrigger>
      </TabsList>
      
      <TabsContent value="subscriptions">
        <SubscriptionsTab
          clientId={clientId}
          clientName={clientName}
          plans={availablePlans}
        />
      </TabsContent>
    </Tabs>
  );
}
```

### With Dashboard Analytics

```typescript
// Use subscription data in dashboard
import { useSubscriptions } from './features/subscriptions';

function DashboardStats() {
  const { data: subscriptions } = useSubscriptions('all-clients');
  
  const activeSubscriptions = subscriptions?.filter(
    sub => sub.status === 'active'
  ).length || 0;
  
  return (
    <StatsCard
      title="Suscripciones Activas"
      value={activeSubscriptions}
      icon={<CreditCard />}
    />
  );
}
```

This module provides a complete solution for managing gym subscriptions and payments with a modern, type-safe, and performant React implementation.
