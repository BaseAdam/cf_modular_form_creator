import styled from 'styled-components'
import type { Resource } from '../../../types/resource'
import { isBasicInfoComplete, isProjectDetailsComplete } from '../rules'

interface ModuleProgressProps {
  resource: Resource
}

export function ModuleProgress({ resource }: ModuleProgressProps) {
  const modules = [
    { label: 'Basic Info', done: isBasicInfoComplete(resource.basicInfo) },
    { label: 'Project Details', done: isProjectDetailsComplete(resource.projectDetails) },
  ]
  const completed = modules.filter((module) => module.done).length

  return (
    <Wrapper>
      <Count>{completed}/2 modules complete</Count>
      <Pills>
        {modules.map((module) => (
          <Pill key={module.label} $done={module.done}>
            {module.done ? '✓' : '○'} {module.label}
          </Pill>
        ))}
      </Pills>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Count = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Pill = styled.span<{ $done: boolean }>`
  font-size: 0.8rem;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid
    ${({ theme, $done }) => ($done ? theme.colors.success : theme.colors.border)};
  color: ${({ theme, $done }) =>
    $done ? theme.colors.success : theme.colors.inkMuted};
  background: ${({ theme, $done }) =>
    $done ? 'rgba(46, 139, 87, 0.08)' : theme.colors.surface};
`
