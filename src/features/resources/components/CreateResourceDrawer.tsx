import { useState, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Drawer, Input } from '../../../design-system'
import { ApiError } from '../../../api/client'
import { useCreateResource } from '../hooks/useResourceMutations'
import { validateResourceName } from '../validation'

interface CreateResourceDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateResourceDrawer({ isOpen, onClose }: CreateResourceDrawerProps) {
  const navigate = useNavigate()
  const createResource = useCreateResource()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | undefined>()

  const reset = () => {
    setName('')
    setError(undefined)
    createResource.reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    const validationError = validateResourceName(name)
    if (validationError) {
      setError(validationError)
      return
    }

    createResource.mutate(name.trim(), {
      onSuccess: (resource) => {
        reset()
        onClose()
        navigate(`/resources/${resource.resourceId}`)
      },
      onError: (mutationError) => {
        setError(
          mutationError instanceof ApiError
            ? mutationError.message
            : 'Could not create the resource. Please try again.',
        )
      },
    })
  }

  return (
    <Drawer title="Create resource" isOpen={isOpen} onClose={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Resource name"
          placeholder="e.g. Onboarding portal"
          value={name}
          autoFocus
          error={error}
          helperText="Letters, numbers, spaces and hyphens. Cannot be changed later."
          onChange={(event) => {
            setName(event.target.value)
            if (error) setError(undefined)
          }}
        />
        <Footer>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createResource.isPending || name.trim().length === 0}
          >
            {createResource.isPending ? 'Creating…' : 'Create'}
          </Button>
        </Footer>
      </Form>
    </Drawer>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`
