import { Badge } from '../../../design-system'
import type { ResourceStatus } from '../../../types/resource'

interface StatusBadgeProps {
  status: ResourceStatus
}

const STATUS_LABEL: Record<ResourceStatus, string> = {
  draft: 'Draft',
  completed: 'Completed',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={status === 'completed' ? 'success' : 'warning'}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}
