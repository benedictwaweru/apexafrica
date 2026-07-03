import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/login/forgot-password')({
  head: () => ({
    meta: [
      { title: 'Password Recovery | Apex Africa' },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/login/forgot-password"!</div>
}
