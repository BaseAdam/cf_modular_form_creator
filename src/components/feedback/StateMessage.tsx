import type { ReactNode } from 'react'
import styled from 'styled-components'

interface StateMessageProps {
  title: string
  description?: string
  action?: ReactNode
  tone?: 'neutral' | 'error'
}

export function StateMessage({
  title,
  description,
  action,
  tone = 'neutral',
}: StateMessageProps) {
  return (
    <Wrapper>
      <Title $tone={tone}>{title}</Title>
      {description ? <Description>{description}</Description> : null}
      {action ? <Actions>{action}</Actions> : null}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`

const Title = styled.h2<{ $tone: 'neutral' | 'error' }>`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.1rem;
  color: ${({ theme, $tone }) =>
    $tone === 'error' ? theme.colors.warning : theme.colors.ink};
  margin: 0;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
  margin: 0;
  max-width: 420px;
`

const Actions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`
