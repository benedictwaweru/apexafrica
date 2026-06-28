import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/register/"!</div>
}
