import { describe, expect, it } from 'vitest'
import type { BasicInfo, ProjectDetails, Resource } from '../../types/resource'
import {
  canEditProjectDetails,
  canProvision,
  isBasicInfoComplete,
  isCompleted,
  isDraft,
  isProjectDetailsComplete,
} from './rules'

const fullBasicInfo: BasicInfo = {
  resourceName: 'Apollo',
  owner: 'Ada Lovelace',
  email: 'ada@example.com',
  description: 'a resource',
  priority: 'high',
}

const fullProjectDetails: ProjectDetails = {
  projectName: 'Mercury',
  budget: '1000',
  category: 'internal',
  options: ['FE devs'],
}

const makeResource = (overrides: Partial<Resource> = {}): Resource => ({
  _id: '1',
  resourceId: 1,
  name: 'Apollo',
  status: 'draft',
  basicInfo: fullBasicInfo,
  projectDetails: fullProjectDetails,
  createdAt: '',
  updatedAt: '',
  ...overrides,
})

describe('isBasicInfoComplete', () => {
  it('is true when every field is filled', () => {
    expect(isBasicInfoComplete(fullBasicInfo)).toBe(true)
  })

  it.each(['resourceName', 'owner', 'email', 'description', 'priority'] as const)(
    'is false when %s is empty',
    (field) => {
      expect(isBasicInfoComplete({ ...fullBasicInfo, [field]: '' })).toBe(false)
    },
  )
})

describe('isProjectDetailsComplete', () => {
  it('is true when every field is filled and at least one option is selected', () => {
    expect(isProjectDetailsComplete(fullProjectDetails)).toBe(true)
  })

  it.each(['projectName', 'budget', 'category'] as const)(
    'is false when %s is empty',
    (field) => {
      expect(isProjectDetailsComplete({ ...fullProjectDetails, [field]: '' })).toBe(
        false,
      )
    },
  )

  it('is false when no team member is selected', () => {
    expect(isProjectDetailsComplete({ ...fullProjectDetails, options: [] })).toBe(false)
  })
})

describe('status guards', () => {
  it('reads draft / completed off the resource status', () => {
    expect(isDraft(makeResource({ status: 'draft' }))).toBe(true)
    expect(isDraft(makeResource({ status: 'completed' }))).toBe(false)
    expect(isCompleted(makeResource({ status: 'completed' }))).toBe(true)
    expect(isCompleted(makeResource({ status: 'draft' }))).toBe(false)
  })
})

describe('canEditProjectDetails', () => {
  it('allows editing a draft once basic info is complete', () => {
    expect(canEditProjectDetails(makeResource())).toBe(true)
  })

  it('blocks editing while basic info is incomplete', () => {
    const resource = makeResource({ basicInfo: { ...fullBasicInfo, owner: '' } })
    expect(canEditProjectDetails(resource)).toBe(false)
  })

  it('blocks editing once the resource is completed', () => {
    expect(canEditProjectDetails(makeResource({ status: 'completed' }))).toBe(false)
  })
})

describe('canProvision', () => {
  it('allows provisioning a draft with both modules complete', () => {
    expect(canProvision(makeResource())).toBe(true)
  })

  it('blocks provisioning when project details are incomplete', () => {
    const resource = makeResource({
      projectDetails: { ...fullProjectDetails, options: [] },
    })
    expect(canProvision(resource)).toBe(false)
  })

  it('blocks provisioning when basic info is incomplete', () => {
    const resource = makeResource({ basicInfo: { ...fullBasicInfo, email: '' } })
    expect(canProvision(resource)).toBe(false)
  })

  it('blocks provisioning a resource that is already completed', () => {
    expect(canProvision(makeResource({ status: 'completed' }))).toBe(false)
  })
})
