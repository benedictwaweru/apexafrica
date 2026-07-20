import { useState } from 'react';

import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import * as z from 'zod';

import { Button } from '@/shared/ui/button';
import { Field, FieldLabel } from '@/shared/ui/field';
import { Progress } from '@/shared/ui/progress';

import {
  type AccountSetupValues,
  accountTypeSchema,
  addCardPaymentSchema,
  addMpesaPaymentSchema,
  carrierDetailsSchema,
  personaSelectionSchema,
  shipperDetailsSchema,
  warehouseOperatorDetailsSchema,
} from '../schemas/account-setup-schema';
import {
  AccountTypeStep,
  AddCardPaymentStep,
  AddMpesaPaymentStep,
  CarrierDetailsStep,
  PersonaSelectionStep,
  ShipperDetailsStep,
  WarehouseOperatorDetailsStep,
} from '../ui/account-setup-steps';

const { fieldContext, formContext /* , useFieldContext, useFormContext */ } =
  createFormHookContexts();

const { useAppForm /* , withForm */ } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

type StepKey = keyof AccountSetupValues;

interface StepConfig {
  key: StepKey;
  schema: z.ZodTypeAny;
  component: React.ComponentType<{ group: any }>;
  when?: (ctx: {
    personae: AccountSetupValues['step2']['personae'];
    paymentMethod: 'mpesa' | 'card';
  }) => boolean;
}

const STEP_CONFIG: StepConfig[] = [
  { key: 'step1', schema: accountTypeSchema, component: AccountTypeStep },
  {
    key: 'step2',
    schema: personaSelectionSchema,
    component: PersonaSelectionStep,
  },
  {
    key: 'step3',
    schema: shipperDetailsSchema,
    component: ShipperDetailsStep,
    when: ({ personae }) => personae.includes('shipper'),
  },
  {
    key: 'step4',
    schema: carrierDetailsSchema,
    component: CarrierDetailsStep,
    when: ({ personae }) => personae.includes('transporter'),
  },
  {
    key: 'step5',
    schema: warehouseOperatorDetailsSchema,
    component: WarehouseOperatorDetailsStep,
    when: ({ personae }) => personae.includes('warehouse'),
  },
  {
    key: 'step6',
    schema: addMpesaPaymentSchema,
    component: AddMpesaPaymentStep,
    when: ({ paymentMethod }) => paymentMethod === 'mpesa',
  },
  {
    key: 'step7',
    schema: addCardPaymentSchema,
    component: AddCardPaymentStep,
    when: ({ paymentMethod }) => paymentMethod === 'card',
  },
];

export function AccountSetupForm() {
  const [step, setStep] = useState(0);

  const accountSetupForm = useAppForm({
    defaultValues: {
      step1: { accountType: undefined },
      step2: {},
      step3: {},
      step4: {},
      step5: {},
      step6: {},
      step7: {},
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <form className="w-[75%] md:w-[50%] space-y-4">
        <Field>
          <FieldLabel htmlFor="progress-upload">
            <span>Step 1 of 3</span>
            <span className="ml-auto">66%</span>
          </FieldLabel>
          <Progress value={66} id="progress-upload" />
        </Field>
        <div>
          <h1 className="text-2xl font-bold text-left">Set Up Your Account</h1>
        </div>

        {/** Forms go here */}

        {/* <AddCardPaymentStep /> */}
        {/* <AccountTypeStep /> */}
        <ShipperDetailsStep />

        <div className="flex items-center justify-center space-x-4">
          <Button type="button" className="w-[50%]" variant="outline">
            Previous
          </Button>
          <Button className="w-[50%]">Next</Button>
        </div>
      </form>
    </div>
  );
}
