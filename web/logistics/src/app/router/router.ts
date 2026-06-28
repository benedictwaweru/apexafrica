import { routeTree } from '@/routeTree.gen';
import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanstackRouter } from '@tanstack/react-router';

export function createRouter() {
  const queryClient = new QueryClient();

  return createTanstackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
  });
}
