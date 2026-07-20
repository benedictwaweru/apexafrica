import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/_layout/resources/news')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/_layout/resources/news"!</div>
}
