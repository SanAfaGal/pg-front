import { Plan } from '../api/types';

// Mock data for plans
export const MOCK_PLANS: Plan[] = [
  {
    id: 'plan-basic',
    name: 'Plan Básico',
    slug: 'plan-basico',
    description: 'Plan básico para acceso limitado al gimnasio',
    price: '50000.0',
    currency: 'COP',
    duration_unit: 'month',
    duration_count: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    meta_info: {
      features: ['Acceso básico', 'Horario limitado'],
      max_visits: 20
    }
  },
  {
    id: 'plan-premium',
    name: 'Plan Premium',
    slug: 'plan-premium',
    description: 'Plan premium con acceso completo y beneficios adicionales',
    price: '80000.0',
    currency: 'COP',
    duration_unit: 'month',
    duration_count: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    meta_info: {
      features: ['Acceso completo', 'Horario extendido', 'Clases grupales'],
      max_visits: -1 // Unlimited
    }
  },
  {
    id: 'plan-annual',
    name: 'Plan Anual',
    slug: 'plan-anual',
    description: 'Plan anual con descuento especial',
    price: '600000.0',
    currency: 'COP',
    duration_unit: 'year',
    duration_count: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    meta_info: {
      features: ['Acceso completo', 'Descuento anual', 'Beneficios exclusivos'],
      max_visits: -1,
      discount: '20%'
    }
  },
  {
    id: 'plan-weekly',
    name: 'Plan Semanal',
    slug: 'plan-semanal',
    description: 'Plan de prueba por una semana',
    price: '15000.0',
    currency: 'COP',
    duration_unit: 'week',
    duration_count: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    meta_info: {
      features: ['Acceso completo', 'Solo una semana'],
      max_visits: 7
    }
  },
  {
    id: 'plan-inactive',
    name: 'Plan Descontinuado',
    slug: 'plan-descontinuado',
    description: 'Plan que ya no está disponible',
    price: '30000.0',
    currency: 'COP',
    duration_unit: 'month',
    duration_count: 1,
    is_active: false,
    created_at: '2023-12-01T00:00:00Z',
    updated_at: '2023-12-31T00:00:00Z',
    meta_info: {}
  }
];

// Mock API delay
export const mockApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock function to get active plans
export const mockGetActivePlans = async (limit: number = 100, offset: number = 0): Promise<Plan[]> => {
  await mockApiDelay();
  
  // Filter only active plans
  const activePlans = MOCK_PLANS.filter(plan => plan.is_active);
  
  // Apply pagination
  const startIndex = offset;
  const endIndex = Math.min(startIndex + limit, activePlans.length);
  
  return activePlans.slice(startIndex, endIndex);
};

// Mock function to get plan by ID
export const mockGetPlanById = async (planId: string): Promise<Plan | null> => {
  await mockApiDelay();
  
  const plan = MOCK_PLANS.find(p => p.id === planId);
  return plan || null;
};


