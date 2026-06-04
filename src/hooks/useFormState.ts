import { useState } from 'react'

export function useFormState<T extends object>(initial: T) {
  const [values, setValues] = useState<T>(initial)

  const setField = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }))
  }

  return { values, setValues, setField }
}
