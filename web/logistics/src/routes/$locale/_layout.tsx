import { Outlet, createFileRoute } from '@tanstack/react-router';

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
      <Footer />
    </>
  );
}
