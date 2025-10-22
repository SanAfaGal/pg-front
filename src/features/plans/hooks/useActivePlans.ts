import { useQuery } from '@tanstack/react-query'
import { fetchActivePlans } from '../api/planApi'

export const useActivePlans = () => {
  console.log('useActivePlans hook called')
  
  return useQuery({
    queryKey: ['plans', 'active'],
    queryFn: async () => {
      console.log('useActivePlans - calling fetchActivePlans')
      const result = await fetchActivePlans()
      console.log('useActivePlans - result:', result)
      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    enabled: true, // siempre activo
  })
}
