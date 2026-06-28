import { QueryClientProvider } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';

import type { RouterContext } from '@/shared/types/types';

import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';
import { ThemeProvider } from '@/app/providers/theme-provider';

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

    meta: [
      { title: 'Apex Africa Logistics: The Most Trusted Logistics Platform' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HeadContent />
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
        <Toaster visibleToasts={1} position="top-center" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
