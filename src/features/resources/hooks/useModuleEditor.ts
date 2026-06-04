import { useMemo, useState } from 'react'
import type { UseMutationResult } from '@tanstack/react-query'
import { ApiError } from '../../../api/client'
import type { Resource } from '../../../types/resource'
import type { ResourcePayload } from '../../../types/api'
import { useFormState } from '../../../hooks/useFormState'
import { hasErrors, type FieldErrors } from '../validation'

interface ModuleEditorConfig<T extends object> {
  isDraft: boolean
  serverValue: T
  validate: (value: T) => FieldErrors<T>
  toReplacePayload: (value: T) => ResourcePayload
  patchMutation: UseMutationResult<Resource, Error, T>
  replaceMutation: UseMutationResult<Resource, Error, ResourcePayload>
}

export interface ModuleEditor<T extends object> {
  values: T
  errors: FieldErrors<T>
  submitError: string | undefined
  isDirty: boolean
  isSaving: boolean
  setField: <K extends keyof T>(key: K, value: T[K]) => void
  submit: (onSaved?: () => void) => void
}

const stableStringify = (value: unknown): string =>
  JSON.stringify(value, (_key, val) =>
    Array.isArray(val) ? [...val].sort() : val,
  )

const readableError = (error: unknown): string =>
  error instanceof ApiError
    ? error.message
    : 'Something went wrong while saving. Please try again.'

export function useModuleEditor<T extends object>({
  isDraft,
  serverValue,
  validate,
  toReplacePayload,
  patchMutation,
  replaceMutation,
}: ModuleEditorConfig<T>): ModuleEditor<T> {
  const { values, setField } = useFormState<T>(serverValue)
  const [errors, setErrors] = useState<FieldErrors<T>>({})
  const [submitError, setSubmitError] = useState<string>()

  const isDirty = useMemo(
    // cheap deep-compare: form state is small, flat and json-serializable.
    // arrays (e.g. options) are sorted so selection order doesn't read as a change.
    () => stableStringify(values) !== stableStringify(serverValue),
    [values, serverValue],
  )

  const isSaving = patchMutation.isPending || replaceMutation.isPending

  const submit = (onSaved?: () => void) => {
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setSubmitError(undefined)
    const handlers = {
      onSuccess: () => onSaved?.(),
      onError: (error: unknown) => setSubmitError(readableError(error)),
    }

    if (isDraft) {
      patchMutation.mutate(values, handlers)
    } else {
      replaceMutation.mutate(toReplacePayload(values), handlers)
    }
  }

  return { values, errors, submitError, isDirty, isSaving, setField, submit }
}
