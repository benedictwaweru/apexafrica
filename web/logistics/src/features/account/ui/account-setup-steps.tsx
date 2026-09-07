import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CheckIcon, XIcon } from 'lucide-react';

import AmexLogo from '@/shared/assets/images/amex-logo.svg';
import DiscoverLogo from '@/shared/assets/images/discover-logo.svg';
import MastercardLogo from '@/shared/assets/images/mastercard-logo.svg';
import VisaBlackLogo from '@/shared/assets/images/visa-logo-black.svg';
import VisaWhiteLogo from '@/shared/assets/images/visa-logo-white.svg';

import { Checkbox } from '@/shared/ui/checkbox';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/ui/input-group';
import { MultiSelect } from '@/shared/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Select, SelectTrigger, SelectValue } from '@/shared/ui/select';

import type { AccountSetupFormApi } from '../hooks/use-account-setup-form';
import { identifyCard, luhn } from '../libs/helpers';
import { type Country, allCountries, getFlagUrl } from '../libs/i18n';
import {
  type AccountSetupValues,
  accountTypeSchema,
  businessDetailsSchema,
  personaSelectionSchema,
} from '../schemas/account-setup-schema';
import type { CardProvider } from '../types/types';

interface AccountSetupStepsProps {
  form: AccountSetupFormApi;
}

export function PersonaSelectionStep({ form }: AccountSetupStepsProps) {
  const personae = [
    {
      id: 'shipper',
      label: 'I want to ship cargo',
    },
    {
      id: 'transporter',
      label: 'I want to transport cargo',
    },
    {
      id: 'warehouse',
      label: 'I manage a warehouse, depot or storage facility',
    },
  ] as const;

  return (
    <form.Field
      name="step1.personae"
      mode="array"
      validators={{ onBlur: personaSelectionSchema.shape.personae }}
    >
      {(field) => {
        const {
          state: {
            value,
            meta: { errors, isTouched, isValid },
          },
          handleBlur,
        } = field;

        const isInvalid = isTouched && !isValid;

        return (
          <FieldSet>
            <FieldLegend variant="label">What best describes you?</FieldLegend>
            <FieldDescription>
              You can select more than one. Your selection determines which
              dashboards you'll have access to.:
            </FieldDescription>
            <FieldGroup className="gap-3">
              {personae.map((option) => (
                <Field key={option.id} orientation="horizontal">
                  <Checkbox
                    id={`persona-${option.id}`}
                    name={`persona-${option.id}`}
                    checked={value.includes(option.id)}
                    onBlur={handleBlur}
                    onCheckedChange={(checked) =>
                      checked
                        ? field.pushValue(option.id)
                        : field.removeValue(value.indexOf(option.id))
                    }
                  />
                  <FieldLabel
                    htmlFor={`persona-${option.id}`}
                    className="font-normal"
                  >
                    {option.label}
                  </FieldLabel>
                </Field>
              ))}
              {isInvalid && <FieldError errors={errors} />}
            </FieldGroup>
          </FieldSet>
        );
      }}
    </form.Field>
  );
}

export function AccountTypeStep({ form }: AccountSetupStepsProps) {
  return (
    <form.Field
      name="step2.accountType"
      validators={{ onBlur: accountTypeSchema.shape.accountType }}
    >
      {(field) => {
        const {
          state: {
            value,
            meta: { errors, isTouched, isValid },
          },
          handleChange,
          handleBlur,
        } = field;

        const isInvalid = isTouched && !isValid;

        return (
          <FieldSet>
            <FieldLegend variant="label">Account Type</FieldLegend>
            <FieldDescription>
              Select the account type that most accurately describes yourself.
            </FieldDescription>
            <RadioGroup
              value={value}
              onBlur={handleBlur}
              onValueChange={(value) =>
                handleChange(
                  value as AccountSetupValues['step2']['accountType'],
                )
              }
            >
              <FieldLabel htmlFor="individual-plan">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Individual</FieldTitle>
                    <FieldDescription>
                      You're operating on your own behalf.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="individual" id="individual-plan" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="business-plan">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Business</FieldTitle>
                    <FieldDescription>
                      You work under a company, business or organisation. You'll
                      be asked for your business' or your organisation's
                      details.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="business" id="business-plan" />
                </Field>
              </FieldLabel>
            </RadioGroup>
            {isInvalid && <FieldError errors={errors} />}
          </FieldSet>
        );
      }}
    </form.Field>
  );
}

export function BusinessDetailsStep({ form }: AccountSetupStepsProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Country | null>(null);

  const { data: countryCode } = useQuery({
    queryKey: ['detect-country'],
    queryFn: async () => {
      const { data } = await axios.get('https://ipapi.co/json/');

      return data.country_code as string;
    },
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (!countryCode) return;

    const match = allCountries.find((c) => c.code === countryCode);
    if (match) setSelected(match);
  }, [countryCode]);

  function handleSelect(country: Country) {
    setSelected(country);
    setOpen(false);
  }

  return (
    <FieldSet>
      <FieldLegend variant="label">
        Enter your business's or organisation's details
      </FieldLegend>
      <FieldDescription>
        You will be asked to verify your business details.
      </FieldDescription>

      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="step3.businessName"
            validators={{ onBlur: businessDetailsSchema.shape.businessName }}
          >
            {(field) => {
              const {
                state: {
                  value,
                  meta: { errors, isTouched, isValid },
                },
                name,
                handleChange,
                handleBlur,
              } = field;
              const isInvalid = isTouched && !isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={name}>
                    Business Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    type="text"
                    id={name}
                    placeholder="Apex Africa LLC"
                    value={value}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    required
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field
            name="step3.registrationNumber"
            validators={{
              onBlur: businessDetailsSchema.shape.registrationNumber,
            }}
          >
            {(field) => {
              const {
                state: {
                  value,
                  meta: { errors, isTouched, isValid },
                },
                name,
                handleChange,
                handleBlur,
              } = field;
              const isInvalid = isTouched && !isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={name}>
                    Registration Number{' '}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    type="text"
                    id={name}
                    placeholder="PVT-XXXXXXXX"
                    value={value}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    required
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="step3.businessEmail"
            validators={{ onBlur: businessDetailsSchema.shape.businessEmail }}
          >
            {(field) => {
              const {
                state: {
                  value,
                  meta: { errors, isTouched, isValid },
                },
                name,
                handleChange,
                handleBlur,
              } = field;
              const isInvalid = isTouched && !isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={name}>
                    Business Email <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    type="email"
                    id={name}
                    placeholder="business@email.com"
                    value={value}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    required
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Field>
            <FieldLabel htmlFor="checkout-7j9-country-list-uw1">
              Country <span className="text-destructive">*</span>
            </FieldLabel>
            <Select>
              <SelectTrigger className="w-full" onClick={() => setOpen(true)}>
                {selected ? (
                  <>
                    <img
                      src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
                      width={20}
                      alt={`${selected.name} flag`}
                      className="rounded-xs shrink-0"
                    />
                    <span className="flex-1 text-sm text-left">
                      {selected.name}
                    </span>
                  </>
                ) : (
                  <SelectValue placeholder="Select a country" />
                )}
              </SelectTrigger>
            </Select>

            <CommandDialog open={open} onOpenChange={setOpen}>
              <Command>
                <CommandInput placeholder="Search by country name" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Countries">
                    {allCountries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={country.name}
                        onSelect={() => handleSelect(country)}
                      >
                        <img
                          src={getFlagUrl(country.code)}
                          width={20}
                          loading="lazy"
                          alt={`${country.name} flag`}
                          className="rounded-xs shrink-0"
                        />
                        <span className="flex-1 text-sm">{country.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </CommandDialog>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor={'name'}>
              Business Type <span className="text-destructive">*</span>
            </FieldLabel>
            <Select>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select your business type" /></SelectTrigger>
            </Select>
          </Field>

          <form.Field
            name="step3.kraPin"
            validators={{ onBlur: businessDetailsSchema.shape.kraPin }}
          >
            {(field) => {
              const {
                state: {
                  value,
                  meta: { errors, isTouched, isValid },
                },
                name,
                handleChange,
                handleBlur,
              } = field;
              const isInvalid = isTouched && !isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={name}>
                    KRA PIN <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id={name}
                    placeholder="P123456789A"
                    value={value}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    required
                  />
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}

export function ShipperDetailsStep({ form }: AccountSetupStepsProps) {
  return (
    <FieldSet>
      <FieldLegend>Shipper Details</FieldLegend>
      <FieldDescription>Enter your details below.</FieldDescription>
      <FieldGroup></FieldGroup>
    </FieldSet>
  );
}

export function CarrierDetailsStep({ form }: AccountSetupStepsProps) {
  return (
    <FieldSet>
      <FieldLegend>Carrier Details</FieldLegend>
      <FieldDescription>Enter your details below.</FieldDescription>
    </FieldSet>
  );
}

export function WarehouseOperatorDetailsStep({ form }: AccountSetupStepsProps) {
  return (
    <FieldSet>
      <FieldLegend>Warehouse Operator Details</FieldLegend>
      <FieldDescription>Enter your details below.</FieldDescription>
    </FieldSet>
  );
}

// --------------------------------PAYMENT STEP------------------------------------

export function AddMpesaPaymentStep({ form }: AccountSetupStepsProps) {
  return (
    <FieldSet>
      <FieldLegend>M-Pesa Payment Details</FieldLegend>
    </FieldSet>
  );
}

const CARD_LENGTH: Record<CardProvider, number> = {
  visa: 16,
  mastercard: 16,
  amex: 15,
  discover: 16,
};

function CardLogo({ type }: { type: CardProvider }) {
  if (type === 'visa') {
    return (
      <>
        <img src={VisaBlackLogo} alt="Visa" className="h-6 dark:hidden" />
        <img src={VisaWhiteLogo} alt="Visa" className="hidden h-6 dark:block" />
      </>
    );
  }

  if (type === 'mastercard') {
    return <img src={MastercardLogo} alt="Mastercard" className="h-6" />;
  }

  if (type === 'amex') {
    return <img src={AmexLogo} alt="Amex" className="h-6" />;
  }

  if (type === 'discover') {
    return <img src={DiscoverLogo} alt="Discover" className="h-6" />;
  }

  return null;
}

export function AddCardPaymentStep({ form }: AccountSetupStepsProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  const raw = cardNumber.replace(/\s+/g, '');
  const cardType = identifyCard(raw);
  const expectedLength = cardType ? CARD_LENGTH[cardType] : 16;
  const isComplete = raw.length >= expectedLength;

  const isValid = isComplete && luhn(raw);
  const isInvalid = isComplete && !luhn(raw);

  function handleCardChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, expectedLength);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? digits;
    setCardNumber(formatted);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const digits = text.replace(/\D/g, '').slice(0, expectedLength);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? digits;
    setCardNumber(formatted);
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);

    let formatted = digits;

    if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)} / ${digits.slice(2, 6)}`;
    }

    setExpiry(formatted);
  }

  return (
    <FieldSet>
      <FieldLegend>Payment Method</FieldLegend>
      <FieldDescription>
        All transactions are secure and encrypted
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="checkout-7j9-card-name-43j">
            Name on Card <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="checkout-7j9-card-name-43j"
            placeholder="John Smith"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
            Card Number <span className="text-destructive">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="checkout-7j9-card-number-uw1"
              value={cardNumber}
              onChange={handleCardChange}
              onPaste={handlePaste}
              onDrop={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={expectedLength + Math.floor((expectedLength - 1) / 4)}
            />
            <InputGroupAddon
              align="inline-end"
              className="flex items-center gap-2"
            >
              {cardType && <CardLogo type={cardType} />}
              {isValid && (
                <CheckIcon className="text-success" size={16} strokeWidth={3} />
              )}
              {isInvalid && (
                <XIcon className="text-destructive" size={16} strokeWidth={3} />
              )}
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>Enter your 16-digit card number</FieldDescription>
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="checkout-7j9-expiry">
              Expiry Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="checkout-7j9-expiry"
              value={expiry}
              onChange={handleExpiryChange}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && expiry.endsWith(' / ')) {
                  e.preventDefault();
                  setExpiry(expiry.slice(0, -3));
                }
              }}
              placeholder="MM / YYYY"
              inputMode="numeric"
              maxLength={10}
              autoComplete="cc-exp"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="checkout-7j9-cvv">
              CVV <span className="text-destructive">*</span>
            </FieldLabel>
            <Input id="checkout-7j9-cvv" placeholder="123" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="checkout-7j9-postal-code">
              Postal Code
            </FieldLabel>
            <Input id="checkout-7j9-postal-code" placeholder="00100" />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}

export function ReviewFormDetails() {}
