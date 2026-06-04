import type { SelectOption } from '../../design-system'

export const PRIORITY_VALUES = ['low', 'medium', 'high'] as const
export const CATEGORY_VALUES = ['internal', 'external', 'vendor'] as const
export const TEAM_MEMBER_VALUES = [
  'FE devs',
  'BE devs',
  'Designer',
  'Data Eng',
  'Product Owner',
] as const

const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const toOptions = (values: readonly string[]): SelectOption[] =>
  values.map((value) => ({ value, label: toTitleCase(value) }))

export const PRIORITY_OPTIONS = toOptions(PRIORITY_VALUES)

export const CATEGORY_OPTIONS = toOptions(CATEGORY_VALUES)

export const TEAM_MEMBER_OPTIONS: string[] = [...TEAM_MEMBER_VALUES]
