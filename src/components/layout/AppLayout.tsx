import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Shell>
      <Header>
        <Brand to="/resources">Resources Manager</Brand>
      </Header>
      <Main>{children}</Main>
    </Shell>
  )
}

const Shell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
`

const Brand = styled(Link)`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.inkStrong};
  text-decoration: none;
`

const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
`
