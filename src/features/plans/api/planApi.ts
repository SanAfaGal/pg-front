import { apiClient, API_ENDPOINTS } from '../../../shared'
import { Plan } from './types'

export const fetchActivePlans = async (
  limit: number = 100,
  offset: number = 0
): Promise<Plan[]> => {
  console.log('fetchActivePlans called with:', { limit, offset })
  
  try {
    const data = await apiClient.get<Plan[]>(API_ENDPOINTS.plans.list, {
      params: {
        is_active: 'true',
        limit,
        offset,
      }
    })
    
    console.log('fetchActivePlans response:', data)
    return data
  } catch (error) {
    console.error('fetchActivePlans error:', error)
    throw error
  }
}
