import { useMutation } from '@tanstack/react-query'
import type { BasicInfo, ProjectDetails } from '../../../types/resource'
import type { ResourcePayload } from '../../../types/api'
import { resourcesApi } from '../resources.api'
import { useInvalidateResource } from './useInvalidateResource'

export function useCreateResource() {
  const invalidate = useInvalidateResource()
  return useMutation({
    mutationFn: (resourceName: string) => resourcesApi.create(resourceName),
    onSuccess: (resource) => invalidate(resource),
  })
}

export function useDeleteResource() {
  const invalidate = useInvalidateResource()
  return useMutation({
    mutationFn: (id: string) => resourcesApi.remove(id),
    onSuccess: () => invalidate(),
  })
}

export function useUpdateBasicInfo(id: string) {
  const invalidate = useInvalidateResource()
  return useMutation({
    mutationFn: (data: BasicInfo) => resourcesApi.updateBasicInfo(id, data),
    onSuccess: (resource) => invalidate(resource),
  })
}

export function useUpdateProjectDetails(id: string) {
  const invalidate = useInvalidateResource()
  return useMutation({
    mutationFn: (data: ProjectDetails) =>
      resourcesApi.updateProjectDetails(id, data),
    onSuccess: (resource) => invalidate(resource),
  })
}

export function useProvisionResource(id: string) {
  const invalidate = useInvalidateResource()
  return useMutation({
    mutationFn: () => resourcesApi.provision(id),
    onSuccess: (resource) => invalidate(resource),
  })
}

export function useReplaceResource(id: string) {
  const invalidate = useInvalidateResource()
  return useMutation({
    mutationFn: (payload: ResourcePayload) => resourcesApi.replace(id, payload),
    onSuccess: (resource) => invalidate(resource),
  })
}
