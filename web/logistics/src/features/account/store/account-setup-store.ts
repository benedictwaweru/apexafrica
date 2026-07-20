import { createStore } from '@tanstack/react-store';

export type AccountSetupStage =
  | 'user-details'
  | 'persona-selection'
  | 'account-type'
  | 'shipper-details'
  | 'carrier-details'
  | 'warehouse-operator-details'
  | 'add-payment-method';

export interface AccountSetupState {
  stage: AccountSetupStage;
}

const INITIAL_STATE: AccountSetupState = {
  stage: 'user-details',
};

export const accountSetupStore = createStore<AccountSetupState>(INITIAL_STATE);
