import { apiClient, API_ENDPOINTS, logger } from '../../../shared'
import { Plan } from './types'

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
