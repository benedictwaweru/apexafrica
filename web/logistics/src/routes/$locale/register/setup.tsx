import { createFileRoute } from '@tanstack/react-router';

import { AccountSetupForm } from '@/features/account/pages/account-setup-form';

export const Route = createFileRoute('/$locale/register/setup')({
  head: () => ({
    meta: [{ title: 'Set Up Your Account | Apex Africa' }],
  }),
  component: AccountSetupForm,
});
