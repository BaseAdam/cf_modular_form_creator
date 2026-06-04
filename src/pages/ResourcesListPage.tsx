import { useState } from 'react'
import styled from 'styled-components'
import { Button, Input, Select } from '../design-system'
import type { ResourceStatus } from '../types/resource'
import { StateMessage } from '../components/feedback/StateMessage'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { CreateResourceDrawer } from '../features/resources/components/CreateResourceDrawer'
import { ResourceCard } from '../features/resources/components/ResourceCard'
import { useResources } from '../features/resources/hooks/useResources'
import { useDeleteResource } from '../features/resources/hooks/useResourceMutations'
import type { Resource } from '../types/resource'

const PAGE_SIZE = 10

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
]

export function ResourcesListPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | ''>('')
  const [nameInput, setNameInput] = useState('')
  const [isCreateOpen, setCreateOpen] = useState(false)

  const debouncedName = useDebouncedValue(nameInput)
  const deleteResource = useDeleteResource()

  const query = useResources({
    page,
    pageSize: PAGE_SIZE,
    status: statusFilter || undefined,
    name: debouncedName.trim() || undefined,
    sortOrder: 'desc',
  })

  const resetToFirstPage = () => setPage(1)

  const handleDelete = (resource: Resource) => {
    const confirmed = window.confirm(
      `Delete "${resource.name}"? This action cannot be undone.`,
    )
    if (confirmed) {
      deleteResource.mutate(String(resource.resourceId))
    }
  }

  const items = query.data?.items ?? []
  const pagination = query.data?.pagination

  return (
    <Page>
      <Header>
        <div>
          <Title>Resources</Title>
          <Subtitle>Create, track, and complete your resources.</Subtitle>
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          + Create resource
        </Button>
      </Header>

      <Filters>
        <Input
          label="Search by name"
          placeholder="Search resources…"
          value={nameInput}
          onChange={(event) => {
            setNameInput(event.target.value)
            resetToFirstPage()
          }}
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as ResourceStatus | '')
            resetToFirstPage()
          }}
        />
      </Filters>

      <Content>
        {query.isLoading ? (
          <StateMessage title="Loading resources…" />
        ) : query.isError ? (
          <StateMessage
            tone="error"
            title="Could not load resources"
            description="Check that the backend is running and try again."
            action={
              <Button type="button" onClick={() => query.refetch()}>
                Retry
              </Button>
            }
          />
        ) : items.length === 0 ? (
          <StateMessage
            title="No resources found"
            description="Create your first resource to get started."
            action={
              <Button type="button" onClick={() => setCreateOpen(true)}>
                + Create resource
              </Button>
            }
          />
        ) : (
          <List>
            {items.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                onDelete={handleDelete}
                isDeleting={
                  deleteResource.isPending &&
                  deleteResource.variables === String(resource.resourceId)
                }
              />
            ))}
          </List>
        )}
      </Content>

      {pagination && pagination.totalPages > 1 ? (
        <Pager>
          <Button
            type="button"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <PageInfo>
            Page {pagination.page} of {pagination.totalPages}
          </PageInfo>
          <Button
            type="button"
            variant="secondary"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </Pager>
      ) : null}

      <CreateResourceDrawer
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.6rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Subtitle = styled.p`
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Filters = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const Content = styled.div`
  min-height: 200px;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const Pager = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const PageInfo = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.9rem;
`
