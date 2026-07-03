import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/_layout/legal/acceptable-use')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/_layout/legal/acceptable-use"!</div>
}
