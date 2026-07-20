import { createFileRoute } from '@tanstack/react-router';

import { CreateAccountForm } from '@/features/account/pages/create-account-form';

export const Route = createFileRoute('/$locale/register/')({
  head: () => ({
    meta: [{ title: 'Create an account | Apex Africa' }],
  }),
  component: CreateAccountForm,
});
