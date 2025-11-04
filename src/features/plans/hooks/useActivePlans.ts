import { useQuery } from '@tanstack/react-query'
import { fetchActivePlans } from '../api/planApi'
import { logger } from '../../../shared'

export const useActivePlans = () => {
  logger.debug('useActivePlans hook called')
  
  return useQuery({
    queryKey: ['plans', 'active'],
    queryFn: async () => {
      logger.debug('useActivePlans - calling fetchActivePlans')
      const result = await fetchActivePlans()
      logger.debug('useActivePlans - result:', result)
      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    enabled: true, // siempre activo
  })
}
