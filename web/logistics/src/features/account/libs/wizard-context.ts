import { createContext, useContext } from 'react';

interface WizardContextValue {
  isFirst: boolean;
  isLast: boolean;
  goNext: () => void;
  goBack: () => void;
  paymentMethod: 'mpesa' | 'card';
  setPaymentMethod: (method: 'mpesa' | 'card') => void;
}

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) throw new Error('useWizard must be used within WizardContext');

  return context;
}
