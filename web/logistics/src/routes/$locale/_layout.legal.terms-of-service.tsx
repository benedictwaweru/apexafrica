import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/_layout/legal/terms-of-service')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/$locale/_layout/legal/terms-of-service"!</div>
}
