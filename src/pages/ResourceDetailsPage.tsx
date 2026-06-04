import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card } from '../design-system'
import type { Resource } from '../types/resource'
import { StatusBadge } from '../features/resources/components/StatusBadge'
import { ResourceLoader } from '../features/resources/components/ResourceLoader'

export function ResourceDetailsPage() {
  const { resourceId } = useParams()
  return (
    <ResourceLoader id={resourceId}>
      {(resource) => <Details resource={resource} />}
    </ResourceLoader>
  )
}

const placeholder = (value: string) => (value.trim() ? value : '—')

function Details({ resource }: { resource: Resource }) {
  const navigate = useNavigate()
  const id = String(resource.resourceId)

  const basicRows: Array<[string, string]> = [
    ['Resource name', placeholder(resource.basicInfo.resourceName)],
    ['Owner', placeholder(resource.basicInfo.owner)],
    ['Email', placeholder(resource.basicInfo.email)],
    ['Description', placeholder(resource.basicInfo.description)],
    ['Priority', placeholder(resource.basicInfo.priority)],
  ]

  const projectRows: Array<[string, string]> = [
    ['Project name', placeholder(resource.projectDetails.projectName)],
    ['Budget', placeholder(resource.projectDetails.budget)],
    ['Category', placeholder(resource.projectDetails.category)],
    ['Team members', placeholder(resource.projectDetails.options.join(', '))],
  ]

  return (
    <Wrapper>
      <Header>
        <div>
          <Title>{resource.name}</Title>
          <Meta>#{resource.resourceId} · Summary</Meta>
        </div>
        <StatusBadge status={resource.status} />
      </Header>

      <SummaryCard variant="outline">
        <SectionTitle>Basic Info</SectionTitle>
        <DefinitionList rows={basicRows} />
      </SummaryCard>

      <SummaryCard variant="outline">
        <SectionTitle>Project Details</SectionTitle>
        <DefinitionList rows={projectRows} />
      </SummaryCard>

      <Footer>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(`/resources/${id}`)}
        >
          Back to overview
        </Button>
      </Footer>
    </Wrapper>
  )
}

function DefinitionList({ rows }: { rows: Array<[string, string]> }) {
  return (
    <Dl>
      {rows.map(([label, value]) => (
        <Row key={label}>
          <Dt>{label}</Dt>
          <Dd>{value}</Dd>
        </Row>
      ))}
    </Dl>
  )
}

const Wrapper = styled.div`
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

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.85rem;
`

const SummaryCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Dl = styled.dl`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

const Dt = styled.dt`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.9rem;
`

const Dd = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};
  word-break: break-word;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
`
