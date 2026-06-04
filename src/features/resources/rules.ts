import type { BasicInfo, ProjectDetails, Resource } from '../../types/resource'

export function isBasicInfoComplete(basicInfo: BasicInfo): boolean {
  return Boolean(
    basicInfo.resourceName &&
      basicInfo.owner &&
      basicInfo.email &&
      basicInfo.description &&
      basicInfo.priority,
  )
}

export function isProjectDetailsComplete(projectDetails: ProjectDetails): boolean {
  return Boolean(
    projectDetails.projectName &&
      projectDetails.budget &&
      projectDetails.category &&
      projectDetails.options.length > 0,
  )
}

export function isDraft(resource: Resource): boolean {
  return resource.status === 'draft'
}

export function isCompleted(resource: Resource): boolean {
  return resource.status === 'completed'
}

export function canEditProjectDetails(resource: Resource): boolean {
  return isDraft(resource) && isBasicInfoComplete(resource.basicInfo)
}

export function canProvision(resource: Resource): boolean {
  return (
    isDraft(resource) &&
    isBasicInfoComplete(resource.basicInfo) &&
    isProjectDetailsComplete(resource.projectDetails)
  )
}
