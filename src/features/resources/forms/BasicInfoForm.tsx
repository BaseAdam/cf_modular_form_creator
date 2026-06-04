import styled from 'styled-components'
import { Input, Select } from '../../../design-system'
import type { BasicInfo } from '../../../types/resource'
import { PRIORITY_OPTIONS } from '../constants'
import type { FieldErrors } from '../validation'

interface BasicInfoFormProps {
  values: BasicInfo
  errors: FieldErrors<BasicInfo>
  disabled?: boolean
  onChange: <K extends keyof BasicInfo>(key: K, value: BasicInfo[K]) => void
}

const PRIORITY_SELECT_OPTIONS = [
  { value: '', label: 'Select priority' },
  ...PRIORITY_OPTIONS,
]

export function BasicInfoForm({
  values,
  errors,
  disabled = false,
  onChange,
}: BasicInfoFormProps) {
  return (
    <Fields>
      <Input
        label="Resource name"
        value={values.resourceName}
        state="locked"
        helperText="Locked after creation."
      />
      <Input
        label="Owner"
        value={values.owner}
        error={errors.owner}
        disabled={disabled}
        placeholder="e.g. Jane Doe"
        onChange={(event) => onChange('owner', event.target.value)}
      />
      <Input
        label="Email"
        type="email"
        value={values.email}
        error={errors.email}
        disabled={disabled}
        placeholder="jane@example.com"
        onChange={(event) => onChange('email', event.target.value)}
      />
      <Input
        label="Description"
        multiline
        rows={4}
        value={values.description}
        error={errors.description}
        disabled={disabled}
        placeholder="Describe this resource…"
        onChange={(event) => onChange('description', event.target.value)}
      />
      <Select
        label="Priority"
        options={PRIORITY_SELECT_OPTIONS}
        value={values.priority}
        error={errors.priority}
        disabled={disabled}
        onChange={(event) => onChange('priority', event.target.value)}
      />
    </Fields>
  )
}

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`
