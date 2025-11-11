import { apiClient, API_ENDPOINTS, logger } from '../../../shared'
import { Plan, DurationType } from './types'

export interface PlanCreateInput {
  name: string
  slug?: string
  description?: string
  price: string | number
  currency: string
  duration_unit: DurationType
  duration_count: number
  is_active?: boolean
}

export interface PlanUpdateInput {
  name?: string
  slug?: string
  description?: string
  price?: string | number
  currency?: string
  duration_unit?: DurationType
  duration_count?: number
  is_active?: boolean
}

export const fetchActivePlans = async (
  limit: number = 100,
  offset: number = 0
): Promise<Plan[]> => {
  logger.debug('fetchActivePlans called with:', { limit, offset })
  
  try {
    const data = await apiClient.get<Plan[]>(API_ENDPOINTS.plans.list, {
      params: {
        is_active: 'true',
        limit,
        offset,
      }
    })
    
    logger.debug('fetchActivePlans response:', data)
    return data
  } catch (error) {
    logger.error('fetchActivePlans error:', error)
    throw error
  }
}

export const fetchAllPlans = async (
  is_active?: boolean,
  limit: number = 100,
  offset: number = 0
): Promise<Plan[]> => {
  logger.debug('fetchAllPlans called with:', { is_active, limit, offset })
  
  try {
    const params: Record<string, string | number> = {
      limit,
      offset,
    }
    
    if (is_active !== undefined) {
      params.is_active = is_active.toString()
    }
    
    const data = await apiClient.get<Plan[]>(API_ENDPOINTS.plans.list, {
      params,
    })
    
    logger.debug('fetchAllPlans response:', data)
    return data
  } catch (error) {
    logger.error('fetchAllPlans error:', error)
    throw error
  }
}

export const fetchPlanById = async (id: string): Promise<Plan> => {
  logger.debug('fetchPlanById called with:', { id })
  
  try {
    const data = await apiClient.get<Plan>(API_ENDPOINTS.plans.detail(id))
    logger.debug('fetchPlanById response:', data)
    return data
  } catch (error) {
    logger.error('fetchPlanById error:', error)
    throw error
  }
}

export const searchPlans = async (
  searchTerm: string,
  limit: number = 50
): Promise<Plan[]> => {
  logger.debug('searchPlans called with:', { searchTerm, limit })
  
  try {
    const data = await apiClient.get<Plan[]>('/plans/search', {
      params: {
        q: searchTerm,
        limit,
      }
    })
    
    logger.debug('searchPlans response:', data)
    return data
  } catch (error) {
    logger.error('searchPlans error:', error)
    throw error
  }
}

export const createPlan = async (planData: PlanCreateInput): Promise<Plan> => {
  logger.debug('createPlan called with:', planData)
  
  try {
    const data = await apiClient.post<Plan>(API_ENDPOINTS.plans.list, planData)
    logger.debug('createPlan response:', data)
    return data
  } catch (error) {
    logger.error('createPlan error:', error)
    throw error
  }
}

export const updatePlan = async (
  id: string,
  planData: PlanUpdateInput
): Promise<Plan> => {
  logger.debug('updatePlan called with:', { id, planData })
  
  try {
    const data = await apiClient.put<Plan>(API_ENDPOINTS.plans.detail(id), planData)
    logger.debug('updatePlan response:', data)
    return data
  } catch (error) {
    logger.error('updatePlan error:', error)
    throw error
  }
}

export const deletePlan = async (id: string): Promise<void> => {
  logger.debug('deletePlan called with:', { id })
  
  try {
    await apiClient.delete(API_ENDPOINTS.plans.detail(id))
    logger.debug('deletePlan success')
  } catch (error) {
    logger.error('deletePlan error:', error)
    throw error
  }
}
