import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Card, IconButton } from '../../../design-system'
import type { Resource } from '../../../types/resource'
import { ModuleProgress } from './ModuleProgress'
import { StatusBadge } from './StatusBadge'

interface ResourceCardProps {
  resource: Resource
  onDelete: (resource: Resource) => void
  isDeleting: boolean
}

export function ResourceCard({ resource, onDelete, isDeleting }: ResourceCardProps) {
  const navigate = useNavigate()
  const targetPath = `/resources/${resource.resourceId}`

  return (
    <StyledCard variant="outline" onClick={() => navigate(targetPath)}>
      <Top>
        <Heading>
          <Name>{resource.name}</Name>
          <Meta>#{resource.resourceId}</Meta>
        </Heading>
        <Actions onClick={(event) => event.stopPropagation()}>
          <StatusBadge status={resource.status} />
          <IconButton
            type="button"
            variant="ghost"
            aria-label={`Delete ${resource.name}`}
            disabled={isDeleting}
            onClick={() => onDelete(resource)}
          >
            🗑
          </IconButton>
        </Actions>
      </Top>
      <ModuleProgress resource={resource} />
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Name = styled.span`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Meta = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`
