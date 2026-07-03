import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/_layout/support/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/_layout/support/"!</div>
}
