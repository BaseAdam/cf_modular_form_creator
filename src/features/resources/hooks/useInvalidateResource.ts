import { useQueryClient } from '@tanstack/react-query'
import type { Resource } from '../../../types/resource'
import { resourceKeys } from '../queryKeys'

export function useInvalidateResource() {
  const queryClient = useQueryClient()

  return (resource?: Resource) => {
    queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    if (resource) {
      queryClient.setQueryData(
        resourceKeys.detail(String(resource.resourceId)),
        resource,
      )
      queryClient.setQueryData(resourceKeys.detail(resource._id), resource)
    }
  }
}
