import { QueryClientProvider } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';

import { ThemeProvider } from '@/app/providers/theme-provider';

import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';

export const Route = createRootRouteWithContext()({
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

    meta: [{ title: 'Apex Africa' }],
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
