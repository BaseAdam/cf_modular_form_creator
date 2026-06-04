import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../design-system'
import { ApiError } from '../../../api/client'
import type { Resource } from '../../../types/resource'
import { StateMessage } from '../../../components/feedback/StateMessage'
import { useResource } from '../hooks/useResource'

interface ResourceLoaderProps {
  id: string | undefined
  children: (resource: Resource) => ReactNode
}

export function ResourceLoader({ id, children }: ResourceLoaderProps) {
  const navigate = useNavigate()
  const query = useResource(id)

  if (query.isLoading) {
    return <StateMessage title="Loading resource…" />
  }

  if (query.isError) {
    const notFound = query.error instanceof ApiError && query.error.status === 404
    return (
      <StateMessage
        tone="error"
        title={notFound ? 'Resource not found' : 'Could not load resource'}
        description={
          notFound
            ? 'This resource does not exist or has been deleted.'
            : 'Please check the backend connection and try again.'
        }
        action={
          <Button type="button" onClick={() => navigate('/resources')}>
            Back to resources
          </Button>
        }
      />
    )
  }

  if (!query.data) {
    return null
  }

  return <>{children(query.data)}</>
}
