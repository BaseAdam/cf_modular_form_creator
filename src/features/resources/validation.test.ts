import { describe, expect, it } from 'vitest'
import type { BasicInfo, ProjectDetails } from '../../types/resource'
import { validateBasicInfo, validateProjectDetails } from './validation'

const validBasicInfo: BasicInfo = {
  resourceName: 'Apollo-1',
  owner: 'Ada Lovelace',
  email: 'ada@example.com',
  description: 'a resource',
  priority: 'high',
}

const validProjectDetails: ProjectDetails = {
  projectName: 'Mercury Project',
  budget: '1000',
  category: 'internal',
  options: ['FE devs', 'BE devs'],
}

describe('validateBasicInfo', () => {
  it('accepts a valid module without over-rejecting', () => {
    expect(validateBasicInfo(validBasicInfo)).toEqual({})
  })

  it('reports at most one message per field (toFieldErrors: first rule wins)', () => {
    // an empty name violates both the required and the regex rule; the adapter
    // must collapse them to a single field message
    const errors = validateBasicInfo({ ...validBasicInfo, resourceName: '' })
    expect(errors.resourceName).toBe('Resource name is required')
  })
})

describe('validateProjectDetails', () => {
  it('accepts a valid module without over-rejecting', () => {
    expect(validateProjectDetails(validProjectDetails)).toEqual({})
  })

  it('rejects a non-integer budget (contract is whole-number, not just numeric)', () => {
    expect(validateProjectDetails({ ...validProjectDetails, budget: '12.5' }).budget)
      .toBeDefined()
  })

  it('requires at least one team member', () => {
    const errors = validateProjectDetails({ ...validProjectDetails, options: [] })
    expect(errors.options).toBe('Select at least one team member')
  })
})
