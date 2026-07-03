import { QueryClientProvider } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';

import { type RouterContext } from '@/shared/types/types';

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/africa-continent.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/africa-continent-white.svg',
        media: '(prefers-color-scheme: dark)',
      },
    ],

    meta: [{ title: 'Apex Africa Administration Console' }],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <Outlet />
    </QueryClientProvider>
  );
}
