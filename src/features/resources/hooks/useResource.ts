import { useQuery } from '@tanstack/react-query'
import { resourceKeys } from '../queryKeys'
import { resourcesApi } from '../resources.api'

export function useResource(id: string | undefined) {
  return useQuery({
    queryKey: resourceKeys.detail(id ?? ''),
    queryFn: () => resourcesApi.getById(id!),
    enabled: Boolean(id),
  })
}
