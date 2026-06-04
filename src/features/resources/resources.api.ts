import { http } from '../../api/client'
import type { BasicInfo, ProjectDetails, Resource } from '../../types/resource'
import type {
  ListResourcesParams,
  ResourceListResponse,
  ResourcePayload,
} from '../../types/api'

type ResourceId = string | number

const basePath = '/api/resources'

export const resourcesApi = {
  list: (params: ListResourcesParams) => {
    const query: Record<string, string | number | undefined> = {
      page: params.page,
      pageSize: params.pageSize,
      status: params.status,
      name: params.name,
      sortOrder: params.sortOrder,
    }
    return http.get<ResourceListResponse>(basePath, query)
  },

  getById: (id: ResourceId) => http.get<Resource>(`${basePath}/${id}`),

  create: (resourceName: string) =>
    http.post<Resource>(basePath, { resourceName }),

  updateBasicInfo: (id: ResourceId, data: BasicInfo) =>
    http.patch<Resource>(`${basePath}/${id}/basic-info`, data),

  updateProjectDetails: (id: ResourceId, data: ProjectDetails) =>
    http.patch<Resource>(`${basePath}/${id}/project-details`, data),

  provision: (id: ResourceId) =>
    http.patch<Resource>(`${basePath}/${id}/provisioning`),

  replace: (id: ResourceId, payload: ResourcePayload) =>
    http.put<Resource>(`${basePath}/${id}`, payload),

  remove: (id: ResourceId) => http.delete<Resource>(`${basePath}/${id}`),
}
