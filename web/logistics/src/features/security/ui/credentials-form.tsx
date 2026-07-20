import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

import { useApiMutation } from '@/shared/lib/api';

import type { ResponseType } from '@/shared/types/types';

import { Button } from '@/shared/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Spinner } from '@/shared/ui/spinner';

import { PasswordInput } from '@/shared/widgets/password-input';

import { checkCredentials } from '../api/auth-api';
import {
  credentialsSchema,
  emailFieldSchema,
  passwordFieldSchema,
} from '../schemas/form-schema';
import { loginActions } from '../store/login-store';

interface CredentialsFormProps {
  locale: string;
}

type CredentialsCheckResponse = ResponseType & {
  /** Whether the account has MFA enabled. */
  requiresMFA: boolean;

  /**
   * Short-lived opaque token issued after successful credential verification.
   * Only present when requiresMFA is true; sent back with the TOTP code.
   */
  partialToken?: string;
};

export function CredentialsForm({ locale }: CredentialsFormProps) {
  const {} = useApiMutation<CredentialsCheckResponse>({ method: 'POST', url: '' });

  const credentialsForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },

    validators: {
      onSubmitAsync: credentialsSchema,
    },

    onSubmit: async ({ value }) => {
      loginActions.clearServerError();

      try {
        const result = await checkCredentials(value.email, value.password);

        if (result.requiresMFA && result.partialToken) {
          loginActions.requireMFA(result.partialToken, value.email);
        } else {
          loginActions.authenticate();
          toast.success('Welcome back!');
        }
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : 'Sign-in failed. Please try again.',
        );
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void credentialsForm.handleSubmit();
      }}
      noValidate
    >
      <FieldGroup>
        <credentialsForm.Field
          name="email"
          validators={{ onBlur: emailFieldSchema }}
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
                  Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={name}
                  name={name}
                  type="email"
                  placeholder="m@example.com"
                  value={value}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </credentialsForm.Field>

        <credentialsForm.Field
          name="password"
          validators={{ onBlur: passwordFieldSchema }}
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
              <Field>
                <div className="flex justify-between items-center">
                  <FieldLabel htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </FieldLabel>

                  <Link
                    to="/$locale/login/forgot-password"
                    params={{ locale }}
                    className="ml-auto text-sm underline-offset-2 hover:underline text-primary"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <PasswordInput
                  value={value}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  name={name}
                  isInvalid={isInvalid}
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        </credentialsForm.Field>

        <credentialsForm.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Field>
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? <Spinner className="size-6" /> : 'Log in'}
              </Button>
            </Field>
          )}
        </credentialsForm.Subscribe>

        <FieldSeparator>Or continue with</FieldSeparator>
        <Field orientation="horizontal" className="justify-center">
          <Button type="button" variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="0.98em"
              height="1em"
              viewBox="0 0 256 262"
            >
              <path
                fill="#4285f4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              ></path>
              <path
                fill="#34a853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              ></path>
              <path
                fill="#fbbc05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
              ></path>
              <path
                fill="#eb4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              ></path>
            </svg>
            <span>Google</span>
          </Button>
          <Button type="button" variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
            >
              <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z"></path>
              <path fill="#80cc28" d="M256 121.666H134.335V0H256z"></path>
              <path
                fill="#00adef"
                d="M121.663 256.002H0V134.336h121.663z"
              ></path>
              <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z"></path>
            </svg>
            <span>Microsoft</span>
          </Button>
        </Field>
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link
            to="/$locale/register"
            params={{ locale }}
            className="hover:underline underline-offset-4 cursor-pointer text-primary"
          >
            Create one
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
