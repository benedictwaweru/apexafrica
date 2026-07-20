import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/login/new-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/login/new-password"!</div>
}
