import { createFileRoute } from '@tanstack/react-router';

import { LoginPage } from '@/features/security/pages/login-form';

export const Route = createFileRoute('/$locale/login/')({
  head: () => ({
    meta: [{ title: 'Log In | Apex Africa' }],
  }),
  component: LoginPage,
});
