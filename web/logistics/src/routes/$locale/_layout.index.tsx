import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/_layout/"!</div>
}
