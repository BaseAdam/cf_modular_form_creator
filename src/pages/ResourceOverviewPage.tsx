import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Badge, Button, Card } from '../design-system'
import { ApiError } from '../api/client'
import type { Resource } from '../types/resource'
import { StatusBadge } from '../features/resources/components/StatusBadge'
import { ResourceLoader } from '../features/resources/components/ResourceLoader'
import { useProvisionResource } from '../features/resources/hooks/useResourceMutations'
import {
  canEditProjectDetails,
  canProvision,
  isBasicInfoComplete,
  isCompleted,
  isDraft,
  isProjectDetailsComplete,
} from '../features/resources/rules'

export function ResourceOverviewPage() {
  const { resourceId } = useParams()
  return (
    <ResourceLoader id={resourceId}>
      {(resource) => <Overview resource={resource} />}
    </ResourceLoader>
  )
}

function Overview({ resource }: { resource: Resource }) {
  const navigate = useNavigate()
  const id = String(resource.resourceId)
  const provision = useProvisionResource(id)
  const [provisionError, setProvisionError] = useState<string>()

  const basicDone = isBasicInfoComplete(resource.basicInfo)
  const projectDone = isProjectDetailsComplete(resource.projectDetails)
  const projectLocked = isDraft(resource) && !canEditProjectDetails(resource)

  const handleProvision = () => {
    setProvisionError(undefined)
    provision.mutate(undefined, {
      onSuccess: () => navigate(`/resources/${id}/details`),
      onError: (error) =>
        setProvisionError(
          error instanceof ApiError
            ? error.message
            : 'Provisioning failed. Please try again.',
        ),
    })
  }

  return (
    <Wrapper>
      <BackRow>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/resources')}
        >
          Back to resource list
        </Button>
      </BackRow>

      <Header>
        <div>
          <Title>{resource.name}</Title>
          <Meta>#{resource.resourceId}</Meta>
        </div>
        <StatusBadge status={resource.status} />
      </Header>

      <Modules>
        <ModuleCard
          title="Basic Info"
          done={basicDone}
          actionLabel={basicDone ? 'Edit' : 'Complete'}
          onAction={() => navigate(`/resources/${id}/basic-info`)}
        />
        <ModuleCard
          title="Project Details"
          done={projectDone}
          locked={projectLocked}
          lockedHint="Complete Basic Info first"
          actionLabel={projectDone ? 'Edit' : 'Complete'}
          onAction={() => navigate(`/resources/${id}/project-details`)}
        />
      </Modules>

      <ActionsCard variant="elevated">
        <ActionsHeader>
          <h2>Provisioning</h2>
          <p>
            {isCompleted(resource)
              ? 'This resource is provisioned and completed.'
              : 'Provisioning moves the resource from draft to completed. Both modules must be complete.'}
          </p>
        </ActionsHeader>

        {provisionError ? <ErrorText>{provisionError}</ErrorText> : null}

        <ActionsRow>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/resources/${id}/details`)}
          >
            View details
          </Button>

          {isCompleted(resource) ? (
            <Badge variant="success">Provisioned</Badge>
          ) : (
            <Button
              type="button"
              disabled={!canProvision(resource) || provision.isPending}
              onClick={handleProvision}
            >
              {provision.isPending ? 'Provisioning…' : 'Provision resource'}
            </Button>
          )}
        </ActionsRow>

        {isDraft(resource) && !canProvision(resource) ? (
          <Hint>Complete both modules to enable provisioning.</Hint>
        ) : null}
      </ActionsCard>
    </Wrapper>
  )
}

interface ModuleCardProps {
  title: string
  done: boolean
  locked?: boolean
  lockedHint?: string
  actionLabel: string
  onAction: () => void
}

function ModuleCard({
  title,
  done,
  locked = false,
  lockedHint,
  actionLabel,
  onAction,
}: ModuleCardProps) {
  return (
    <StyledModuleCard variant="outline">
      <ModuleTop>
        <h3>{title}</h3>
        <Badge variant={done ? 'success' : 'neutral'}>
          {done ? 'Complete' : 'Incomplete'}
        </Badge>
      </ModuleTop>
      <Button
        type="button"
        variant="secondary"
        state={locked ? 'locked' : 'normal'}
        onClick={locked ? undefined : onAction}
      >
        {locked ? lockedHint ?? 'Locked' : actionLabel}
      </Button>
    </StyledModuleCard>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const BackRow = styled.div`
  display: flex;
  justify-content: flex-start;
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

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.85rem;
`

const Modules = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const StyledModuleCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const ModuleTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.heading};
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.inkStrong};
  }
`

const ActionsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const ActionsHeader = styled.div`
  h2 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.heading};
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.inkStrong};
  }

  p {
    margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
    color: ${({ theme }) => theme.colors.inkMuted};
  }
`

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const Hint = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.85rem;
`

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.9rem;
`
