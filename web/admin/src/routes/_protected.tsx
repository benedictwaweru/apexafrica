import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  component: AuthenticationGuard,
})

function AuthenticationGuard() {
  return <div>Hello "/_protected"!</div>
}
