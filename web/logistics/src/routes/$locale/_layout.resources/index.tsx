import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/_layout/resources/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/_layout/resources/"!</div>
}
