import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/register/')({
  head: () => ({
    meta: [{ title: 'Create an account | Apex Africa' }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/$locale/register/"!</div>;
}
