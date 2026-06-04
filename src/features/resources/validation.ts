import { z } from 'zod'
import type { BasicInfo, ProjectDetails } from '../../types/resource'
import { CATEGORY_VALUES, PRIORITY_VALUES, TEAM_MEMBER_VALUES } from './constants'

// same regex rules as inside backend
const NAME_REGEX = /^[A-Za-z0-9 -]+$/
const OWNER_REGEX = /^[A-Za-z ]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INTEGER_REGEX = /^\d+$/

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0
}

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(255, `${label} must be at most 255 characters`)
    .regex(
      NAME_REGEX,
      `${label} can contain only letters, numbers, spaces, and hyphens`,
    )

const resourceNameSchema = nameField('Resource name')

export const basicInfoSchema = z.object({
  resourceName: resourceNameSchema,
  owner: z
    .string()
    .trim()
    .min(1, 'Owner is required')
    .max(255, 'Owner must be at most 255 characters')
    .regex(OWNER_REGEX, 'Owner can contain only letters and spaces'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .regex(EMAIL_REGEX, 'Email must be a valid email address'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters'),
  priority: z.enum(PRIORITY_VALUES, { error: 'Select a priority' }),
})

export const projectDetailsSchema = z.object({
  projectName: nameField('Project name'),
  budget: z
    .string()
    .trim()
    .min(1, 'Budget is required')
    .regex(INTEGER_REGEX, 'Budget must be a whole number'),
  category: z.enum(CATEGORY_VALUES, { error: 'Select a category' }),
  options: z
    .array(z.enum(TEAM_MEMBER_VALUES, { error: 'Unsupported team member selected' }))
    .min(1, 'Select at least one team member'),
})

function toFieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const result: FieldErrors<T> = {}
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof T | undefined
    if (key !== undefined && result[key] === undefined) {
      result[key] = issue.message
    }
  }
  return result
}

export function validateBasicInfo(data: BasicInfo): FieldErrors<BasicInfo> {
  const result = basicInfoSchema.safeParse(data)
  return result.success ? {} : toFieldErrors<BasicInfo>(result.error)
}

export function validateProjectDetails(
  data: ProjectDetails,
): FieldErrors<ProjectDetails> {
  const result = projectDetailsSchema.safeParse(data)
  return result.success ? {} : toFieldErrors<ProjectDetails>(result.error)
}

export function validateResourceName(value: string): string | undefined {
  const result = resourceNameSchema.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}
