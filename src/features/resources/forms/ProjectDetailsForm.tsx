import styled from 'styled-components'
import { CheckboxGroup, Input, Select } from '../../../design-system'
import type { ProjectDetails } from '../../../types/resource'
import { CATEGORY_OPTIONS, TEAM_MEMBER_OPTIONS } from '../constants'
import type { FieldErrors } from '../validation'

interface ProjectDetailsFormProps {
  values: ProjectDetails
  errors: FieldErrors<ProjectDetails>
  disabled?: boolean
  onChange: <K extends keyof ProjectDetails>(
    key: K,
    value: ProjectDetails[K],
  ) => void
}

const CATEGORY_SELECT_OPTIONS = [
  { value: '', label: 'Select category' },
  ...CATEGORY_OPTIONS,
]

export function ProjectDetailsForm({
  values,
  errors,
  disabled = false,
  onChange,
}: ProjectDetailsFormProps) {
  return (
    <Fields>
      <Input
        label="Project name"
        value={values.projectName}
        error={errors.projectName}
        disabled={disabled}
        placeholder="e.g. Q3 Platform Revamp"
        onChange={(event) => onChange('projectName', event.target.value)}
      />
      <Input
        label="Budget"
        inputMode="numeric"
        value={values.budget}
        error={errors.budget}
        disabled={disabled}
        placeholder="Whole number, e.g. 50000"
        onChange={(event) => onChange('budget', event.target.value)}
      />
      <Select
        label="Category"
        options={CATEGORY_SELECT_OPTIONS}
        value={values.category}
        error={errors.category}
        disabled={disabled}
        onChange={(event) => onChange('category', event.target.value)}
      />
      <CheckboxGroup
        label="Team members"
        options={TEAM_MEMBER_OPTIONS}
        value={values.options}
        error={errors.options}
        disabled={disabled}
        onChange={(next) => onChange('options', next)}
      />
    </Fields>
  )
}

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`
