import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ListResourcesParams } from '../../../types/api'
import { resourceKeys } from '../queryKeys'
import { resourcesApi } from '../resources.api'

export function useResources(params: ListResourcesParams) {
  return useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: () => resourcesApi.list(params),
    placeholderData: keepPreviousData,
  })
}
