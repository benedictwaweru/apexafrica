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
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Select, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { identifyCard, luhn } from '../libs/helpers';
import { type Country, allCountries, getFlagUrl } from '../libs/i18n';
import type { CardProvider } from '../types/types';
import { TableUpload } from '@/shared/ui/file-upload';

interface AccountSetupStepsProps {
  group: any;
}

export function AccountTypeStep() {
  return (
    <FieldSet>
      <FieldLegend variant="label">Account Type</FieldLegend>
      <FieldDescription>
        Select the account type that most accurately describes yourself.
      </FieldDescription>
      <RadioGroup defaultValue="individual">
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
                You work under a company, business or organisation. You'll be
                asked for your business' or your organisation's details.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="business" id="business-plan" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </FieldSet>
  );
}

export function PersonaSelectionStep() {
  return (
    <FieldSet>
      <FieldLegend variant="label">What best describes you?</FieldLegend>
      <FieldDescription>
        You can select more than one. Your selection determines which dashboards
        you'll have access to:
      </FieldDescription>
      <FieldGroup className="gap-3">
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-hard-disks-ljj-checkbox"
            name="finder-pref-9k2-hard-disks-ljj-checkbox"
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-hard-disks-ljj-checkbox"
            className="font-normal"
          >
            I want to ship cargo
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-external-disks-1yg-checkbox"
            name="finder-pref-9k2-external-disks-1yg-checkbox"
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-external-disks-1yg-checkbox"
            className="font-normal"
          >
            I want to transport cargo
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-cds-dvds-fzt-checkbox"
            name="finder-pref-9k2-cds-dvds-fzt-checkbox"
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-cds-dvds-fzt-checkbox"
            className="font-normal"
          >
            I manage a warehouse, depot or storage facility
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

export function ShipperDetailsStep() {
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
      <FieldLegend>Shipper Details</FieldLegend>
      <FieldGroup>
        {
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                Company Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="checkout-7j9-card-name-43j"
                placeholder="Apex Africa Ltd."
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                KRA PIN
              </FieldLabel>
              <Input
                id="checkout-7j9-card-name-43j"
                placeholder="P123456789A"
                required
              />
            </Field>
          </div>
        }

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
      </FieldGroup>
    </FieldSet>
  );
}

export function CarrierDetailsStep() {
  return (
    <FieldSet>
      <FieldLegend>Carrier Details</FieldLegend>
      <TableUpload />
    </FieldSet>
  );
}

export function WarehouseOperatorDetailsStep() {
  return (
    <FieldSet>
      <FieldLegend></FieldLegend>
    </FieldSet>
  );
}

// --------------------------------PAYMENT STEP------------------------------------

export function AddMpesaPaymentStep() {
  return (
    <FieldSet>
      <FieldLegend></FieldLegend>
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

export function AddCardPaymentStep() {
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

export function AddPaymentMethodStep() {}
