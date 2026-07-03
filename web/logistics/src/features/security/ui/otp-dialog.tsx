import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/shared/ui/input-otp';
import { Spinner } from '@/shared/ui/spinner';

import { verifyTOTP } from '../api/auth-api';
import { mfaSchema } from '../schemas/form-schema';
import { loginActions, loginStore } from '../store/login-store';

interface OtpDialogProps {
  locale: string;
}

export function OtpDialog({ locale }: OtpDialogProps) {
  const partialToken = useSelector(loginStore, (s) => s.partialToken);
  const email = useSelector(loginStore, (s) => s.email);
  const stage = useSelector(loginStore, (s) => s.stage);

  const mFaForm = useForm({
    defaultValues: { code: '' },

    validators: {
      onSubmitAsync: mfaSchema,
    },

    onSubmit: async ({ value }) => {
      if (!partialToken) {
        loginActions.setServerError('Session expired. Please sign in again.');
        loginActions.backToCredentials();

        return;
      }

      loginActions.clearServerError();

      try {
        await verifyTOTP(partialToken, value.code);

        loginActions.authenticate();
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : 'Verification failed. Please try again.',
        );
      }
    },
  });

  return (
    <Dialog
      open={stage === 'mfa'}
      onOpenChange={(open) => {
        if (!open) {
          loginActions.backToCredentials();
        }
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Verify TOTP</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code {email ? ` for ${email}` : ''} shown on your
            authenticator app, such as Google or Microsoft Authenticator.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void mFaForm.handleSubmit();
          }}
          noValidate
        >
          <mFaForm.Field name="code">
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
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={name}>Authentication code</FieldLabel>
                  </div>
                  <InputOTP
                    maxLength={6}
                    id={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    pattern={REGEXP_ONLY_DIGITS}
                    className=""
                  >
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot
                        aria-invalid={isInvalid}
                        className="border-primary"
                        index={0}
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-1" />
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot
                        aria-invalid={isInvalid}
                        className="border-primary"
                        index={1}
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-1" />
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot
                        aria-invalid={isInvalid}
                        className="border-primary"
                        index={2}
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-1" />
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot
                        aria-invalid={isInvalid}
                        className="border-primary"
                        index={3}
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-1" />
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot
                        aria-invalid={isInvalid}
                        className="border-primary"
                        index={4}
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-1" />
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot
                        aria-invalid={isInvalid}
                        className="border-primary"
                        index={5}
                      />
                    </InputOTPGroup>
                  </InputOTP>
                  {isInvalid && <FieldError errors={errors} />}
                </Field>
              );
            }}
          </mFaForm.Field>

          <DialogFooter>
            <mFaForm.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <Field className="w-full">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? <Spinner className="size-6" /> : 'Verify'}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Can't access your authenticator app?{' '}
                    <Link
                      to="/$locale/login/backup-code"
                      params={{ locale }}
                      className="hover:underline underline-offset-4 cursor-pointer text-primary"
                    >
                      Use a backup code
                    </Link>
                  </div>
                </Field>
              )}
            </mFaForm.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
