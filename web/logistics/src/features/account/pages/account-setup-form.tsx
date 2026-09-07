import { useMemo, useState } from 'react';

import { useSelector } from '@tanstack/react-store';
import * as z from 'zod';

import { Button } from '@/shared/ui/button';
import { Field, FieldLabel } from '@/shared/ui/field';
import { Progress } from '@/shared/ui/progress';

import { formContext } from '../context/form-context';
import {
  type AccountSetupFormApi,
  useAccountSetupForm,
} from '../hooks/use-account-setup-form';
import { WizardContext } from '../context/wizard-context';
import {
  type AccountSetupValues,
  accountTypeSchema,
  addCardPaymentSchema,
  addMpesaPaymentSchema,
  businessDetailsSchema,
  carrierDetailsSchema,
  personaSelectionSchema,
  shipperDetailsSchema,
  warehouseOperatorDetailsSchema,
} from '../schemas/account-setup-schema';
import {
  AccountTypeStep,
  AddCardPaymentStep,
  AddMpesaPaymentStep,
  BusinessDetailsStep,
  CarrierDetailsStep,
  PersonaSelectionStep,
  ShipperDetailsStep,
  WarehouseOperatorDetailsStep,
} from '../ui/account-setup-steps';

type StepKey = keyof AccountSetupValues;

interface StepConfig {
  key: StepKey;
  schema: z.ZodTypeAny;
  component: React.ComponentType<{ form: AccountSetupFormApi }>;
  when?: (ctx: {
    accountType: AccountSetupValues['step2']['accountType'];
    personae: AccountSetupValues['step1']['personae'];
    paymentMethod: 'mpesa' | 'card';
  }) => boolean;
}

const STEP_CONFIG: StepConfig[] = [
  {
    key: 'step1',
    schema: personaSelectionSchema,
    component: PersonaSelectionStep,
  },
  { key: 'step2', schema: accountTypeSchema, component: AccountTypeStep },
  {
    key: 'step3',
    schema: businessDetailsSchema,
    component: BusinessDetailsStep,
    when: ({ accountType }) => accountType === 'business',
  },
  {
    key: 'step4',
    schema: shipperDetailsSchema,
    component: ShipperDetailsStep,
    when: ({ personae }) => personae.includes('shipper'),
  },
  {
    key: 'step5',
    schema: carrierDetailsSchema,
    component: CarrierDetailsStep,
    when: ({ personae }) => personae.includes('transporter'),
  },
  {
    key: 'step6',
    schema: warehouseOperatorDetailsSchema,
    component: WarehouseOperatorDetailsStep,
    when: ({ personae }) => personae.includes('warehouse'),
  },
  {
    key: 'step7',
    schema: addMpesaPaymentSchema,
    component: AddMpesaPaymentStep,
    when: ({ paymentMethod }) => paymentMethod === 'mpesa',
  },
  {
    key: 'step8',
    schema: addCardPaymentSchema,
    component: AddCardPaymentStep,
    when: ({ paymentMethod }) => paymentMethod === 'card',
  },
];

export function AccountSetupForm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');

  const accountSetupForm = useAccountSetupForm();

  const accountType = useSelector(
    accountSetupForm.store,
    (s) => s.values.step2.accountType,
  );
  const personae = useSelector(
    accountSetupForm.store,
    (s) => s.values.step1.personae,
  );

  const visibleSteps = useMemo(
    () =>
      STEP_CONFIG.filter(
        (s) => !s.when || s.when({ accountType, personae, paymentMethod }),
      ),
    [accountType, personae, paymentMethod],
  );

  const currentStep = visibleSteps[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === visibleSteps.length - 1;
  const progress = Math.round(((currentIndex + 1) / visibleSteps.length) * 100);

  const wizardCtx = {
    isFirst,
    isLast,
    goNext: () =>
      setCurrentIndex((i) => Math.min(i + 1, visibleSteps.length - 1)),
    goBack: () => setCurrentIndex((i) => Math.max(i - 1, 0)),
    paymentMethod,
    setPaymentMethod,
  };

  const CurrentStepComponent = currentStep.component;

  return (
    <formContext.Provider value={accountSetupForm}>
      <WizardContext.Provider value={wizardCtx}>
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4 py-8">
          <div className="w-[75%] md:w-[50%] space-y-4">
            <Field>
              <FieldLabel htmlFor="progress-upload">
                <span>
                  Step {currentIndex + 1} of {visibleSteps.length}
                </span>
                <span className="ml-auto">{progress}%</span>
              </FieldLabel>
              <Progress value={progress} id="progress-upload" />
            </Field>

            <h1 className="text-2xl font-bold text-left">
              Set Up Your Account
            </h1>

            <accountSetupForm.FormGroup
              key={currentStep.key}
              name={currentStep.key as never}
              validators={{
                onDynamic: currentStep.schema as never,
              }}
              onGroupSubmit={() => {
                if (isLast) {
                  accountSetupForm.handleSubmit();
                } else {
                  wizardCtx.goNext();
                }
              }}
              children={(group) => (
                <div className="space-y-4">
                  <CurrentStepComponent form={accountSetupForm} />
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      type="button"
                      className="w-[50%]"
                      disabled={isFirst}
                      onClick={wizardCtx.goBack}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      className="w-[50%]"
                      onClick={() => group.handleSubmit()}
                    >
                      {isLast ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </WizardContext.Provider>
    </formContext.Provider>
  );
}
