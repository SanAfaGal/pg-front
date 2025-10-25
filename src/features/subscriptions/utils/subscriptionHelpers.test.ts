// Test file for subscription helpers - Day calculation verification
import { getDaysRemaining, getSubscriptionDuration, getSubscriptionProgress } from './subscriptionHelpers';
import { Subscription, SubscriptionStatus } from '../api/types';

// Mock subscription for testing
const createMockSubscription = (startDate: string, endDate: string): Subscription => ({
  id: 'test-id',
  client_id: 'client-id',
  plan_id: 'plan-id',
  start_date: startDate,
  end_date: endDate,
  status: SubscriptionStatus.ACTIVE,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
});

// Test scenarios for day calculations
export const testDayCalculations = () => {
  console.log('🧪 Testing Day Calculations for Subscriptions');
  
  // Test 1: Same day subscription (starts and ends today)
  const today = new Date().toISOString().split('T')[0];
  const sameDaySubscription = createMockSubscription(today, today);
  
  console.log('\n📅 Test 1: Same Day Subscription');
  console.log(`Start: ${today}, End: ${today}`);
  console.log(`Duration: ${getSubscriptionDuration(sameDaySubscription)} días`);
  console.log(`Days Remaining: ${getDaysRemaining(sameDaySubscription)} días`);
  console.log(`Progress: ${getSubscriptionProgress(sameDaySubscription)}%`);
  
  // Test 2: Subscription ending today
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const endingTodaySubscription = createMockSubscription(yesterdayStr, today);
  
  console.log('\n📅 Test 2: Subscription Ending Today');
  console.log(`Start: ${yesterdayStr}, End: ${today}`);
  console.log(`Duration: ${getSubscriptionDuration(endingTodaySubscription)} días`);
  console.log(`Days Remaining: ${getDaysRemaining(endingTodaySubscription)} días`);
  console.log(`Progress: ${getSubscriptionProgress(endingTodaySubscription)}%`);
  
  // Test 3: Subscription ending tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const endingTomorrowSubscription = createMockSubscription(today, tomorrowStr);
  
  console.log('\n📅 Test 3: Subscription Ending Tomorrow');
  console.log(`Start: ${today}, End: ${tomorrowStr}`);
  console.log(`Duration: ${getSubscriptionDuration(endingTomorrowSubscription)} días`);
  console.log(`Days Remaining: ${getDaysRemaining(endingTomorrowSubscription)} días`);
  console.log(`Progress: ${getSubscriptionProgress(endingTomorrowSubscription)}%`);
  
  // Test 4: 30-day subscription starting today
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 29); // +29 because we include both start and end
  const in30DaysStr = in30Days.toISOString().split('T')[0];
  
  const thirtyDaySubscription = createMockSubscription(today, in30DaysStr);
  
  console.log('\n📅 Test 4: 30-Day Subscription Starting Today');
  console.log(`Start: ${today}, End: ${in30DaysStr}`);
  console.log(`Duration: ${getSubscriptionDuration(thirtyDaySubscription)} días`);
  console.log(`Days Remaining: ${getDaysRemaining(thirtyDaySubscription)} días`);
  console.log(`Progress: ${getSubscriptionProgress(thirtyDaySubscription)}%`);
  
  // Test 5: Expired subscription (ended yesterday)
  const dayBeforeYesterday = new Date();
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
  const dayBeforeYesterdayStr = dayBeforeYesterday.toISOString().split('T')[0];
  
  const expiredSubscription = createMockSubscription(dayBeforeYesterdayStr, yesterdayStr);
  
  console.log('\n📅 Test 5: Expired Subscription (Ended Yesterday)');
  console.log(`Start: ${dayBeforeYesterdayStr}, End: ${yesterdayStr}`);
  console.log(`Duration: ${getSubscriptionDuration(expiredSubscription)} días`);
  console.log(`Days Remaining: ${getDaysRemaining(expiredSubscription)} días`);
  console.log(`Progress: ${getSubscriptionProgress(expiredSubscription)}%`);
  
  console.log('\n✅ Day calculation tests completed!');
  
  // Expected results summary
  console.log('\n📊 Expected Results Summary:');
  console.log('• Same day subscription: Duration=1, Remaining=1, Progress=100%');
  console.log('• Ending today: Duration=2, Remaining=1, Progress=100%');
  console.log('• Ending tomorrow: Duration=2, Remaining=2, Progress=50%');
  console.log('• 30-day subscription: Duration=30, Remaining=30, Progress=3%');
  console.log('• Expired subscription: Duration=2, Remaining=0, Progress=100%');
};

// Manual test scenarios
export const manualTestScenarios = [
  {
    name: 'Suscripción de 1 día (hoy)',
    description: 'Inicia y termina el mismo día',
    expectedDuration: 1,
    expectedRemaining: 1,
    expectedProgress: 100,
  },
  {
    name: 'Suscripción terminando hoy',
    description: 'Empezó ayer, termina hoy',
    expectedDuration: 2,
    expectedRemaining: 1,
    expectedProgress: 100,
  },
  {
    name: 'Suscripción de 30 días',
    description: 'Empezó hoy, dura 30 días',
    expectedDuration: 30,
    expectedRemaining: 30,
    expectedProgress: '~3%',
  },
];

// Usage example in browser console:
// import { testDayCalculations } from './subscriptionHelpers.test';
// testDayCalculations();
