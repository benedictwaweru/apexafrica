import { QueryClient } from '@tanstack/react-query';
import {
  AnyRoute,
  createRouter as createTanstackRouter,
} from '@tanstack/react-router';

export function createAppRouter<TRouteTree extends AnyRoute>(
  routeTree: TRouteTree,
  queryClient: QueryClient = new QueryClient(),
) {
  return createTanstackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
  });
}
