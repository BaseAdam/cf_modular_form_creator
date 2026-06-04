import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Button } from '../../../design-system'
import type { Resource } from '../../../types/resource'
import { StatusBadge } from './StatusBadge'

interface ModuleEditorShellProps {
  resource: Resource
  title: string
  children: ReactNode
  isDirty: boolean
  isSaving: boolean
  canSave: boolean
  submitError?: string
  saveLabel: string
  onSave: () => void
  onCancel: () => void
}

export function ModuleEditorShell({
  resource,
  title,
  children,
  isDirty,
  isSaving,
  canSave,
  submitError,
  saveLabel,
  onSave,
  onCancel,
}: ModuleEditorShellProps) {
  const isCompleted = resource.status === 'completed'

  return (
    <Wrapper>
      <Header>
        <div>
          <Title>{title}</Title>
          <Subtitle>
            {resource.name} <span>#{resource.resourceId}</span>
          </Subtitle>
        </div>
        <StatusBadge status={resource.status} />
      </Header>

      {isCompleted ? (
        <Banner $tone="info">
          This resource is completed. Your edits are kept locally and persisted
          only when you submit. They are lost on refresh.
        </Banner>
      ) : null}

      {children}

      {submitError ? <Banner $tone="error">{submitError}</Banner> : null}

      <Footer>
        <DirtyHint>{isDirty ? 'You have unsaved changes.' : null}</DirtyHint>
        <Actions>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Back
          </Button>
          <Button
            type="button"
            disabled={!canSave || isSaving}
            onClick={onSave}
          >
            {isSaving ? 'Saving…' : saveLabel}
          </Button>
        </Actions>
      </Footer>
    </Wrapper>
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
  font-size: 1.5rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Subtitle = styled.p`
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
  color: ${({ theme }) => theme.colors.inkMuted};

  span {
    opacity: 0.7;
  }
`

const Banner = styled.div<{ $tone: 'info' | 'error' }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.9rem;
  border: 1px solid
    ${({ theme, $tone }) =>
      $tone === 'error' ? theme.colors.warning : theme.colors.info};
  color: ${({ theme, $tone }) =>
    $tone === 'error' ? theme.colors.warning : theme.colors.info};
  background: ${({ $tone }) =>
    $tone === 'error' ? 'rgba(180, 71, 27, 0.08)' : 'rgba(60, 90, 137, 0.08)'};
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.md};
`

const DirtyHint = styled.span`
  color: ${({ theme }) => theme.colors.inkMuted};
  font-size: 0.85rem;
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`
