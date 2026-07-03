import { Outlet, createFileRoute } from '@tanstack/react-router';

import { CookieConsentWrapper } from '@/shared/widgets/cookie-consent-wrapper';
import { Footer } from '@/shared/widgets/footer';
import { Header } from '@/shared/widgets/header';

export const Route = createFileRoute('/$locale/_layout')({
  component: Layout,
});

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <CookieConsentWrapper />
      <Footer />
    </>
  );
}
