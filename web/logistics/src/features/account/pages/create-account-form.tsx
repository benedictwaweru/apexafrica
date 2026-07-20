import { useForm } from '@tanstack/react-form';
import { Link, useParams } from '@tanstack/react-router';
import { z } from 'zod';

import { useApiMutation } from '@/shared/lib/api';

import { cn } from '@/shared/lib/utils';

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

import { BlackAfricaLogo, WhiteAfricaLogo } from '@/shared/widgets/icons';

import { signupFormSchema } from '../schemas/create-account-schema';
import { PasswordInput } from '@/shared/widgets/password-input';

type SignupFormSchema = z.infer<typeof signupFormSchema>;

export function CreateAccountForm() {
  const { locale } = useParams({ from: '/$locale/register/' });

  const { mutate, isPending } = useApiMutation<ResponseType, SignupFormSchema>({
    method: 'POST',
    url: '',
    options: {
      onSuccess: () => {},
      onError: () => {},
    },
  });

  const signupForm = useForm({
    defaultValues: { fullName: '', username: '', password: '' },
    validators: {
      onSubmit: signupFormSchema,
    },
    onSubmit: ({ value: { fullName, username, password } }) => {
      mutate({ fullName, username, password });
    },
  });

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1634638021403-70f46d19fc02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHN1cHBseSUyMGNoYWlufGVufDB8fDB8fHww"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-8 p-8 md:p-12">
        <div className="flex justify-center gap-2">
          <Link
            to="/$locale"
            params={{ locale }}
            className="flex items-center gap-2 font-medium"
          >
            <BlackAfricaLogo />
            <WhiteAfricaLogo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form
              className={cn('flex flex-col gap-6')}
              onSubmit={(e) => {
                e.preventDefault();
                signupForm.handleSubmit();
              }}
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Welcome</h1>
                  <p className="text-sm text-balance text-muted-foreground">
                    Create an account
                  </p>
                </div>

                <signupForm.Field
                  name="fullName"
                  children={(field) => {
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
                        <FieldLabel htmlFor={name}>Full Name <span className="text-destructive">*</span></FieldLabel>
                        <Input
                          id={name}
                          name={name}
                          type="text"
                          placeholder="John Smith"
                          value={value}
                          onBlur={handleBlur}
                          onChange={(e) => handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={errors} />}
                      </Field>
                    );
                  }}
                />

                <signupForm.Field
                  name="username"
                  children={(field) => {
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
                        <FieldLabel htmlFor={name}>Email <span className="text-destructive">*</span></FieldLabel>
                        <Input
                          id={name}
                          name={name}
                          type="email"
                          placeholder="m@example.com"
                          value={value}
                          onBlur={handleBlur}
                          onChange={(e) => handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={errors} />}
                      </Field>
                    );
                  }}
                />

                <signupForm.Field
                  name="password"
                  children={(field) => {
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
                        <FieldLabel htmlFor={name}>
                          Password <span className="text-destructive">*</span>
                        </FieldLabel>
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
                />

                <Field>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <Spinner className="size-6" />
                    ) : (
                      'Create account'
                    )}
                  </Button>
                </Field>
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
                      <path
                        fill="#f1511b"
                        d="M121.666 121.666H0V0h121.666z"
                      ></path>
                      <path
                        fill="#80cc28"
                        d="M256 121.666H134.335V0H256z"
                      ></path>
                      <path
                        fill="#00adef"
                        d="M121.663 256.002H0V134.336h121.663z"
                      ></path>
                      <path
                        fill="#fbbc09"
                        d="M256 256.002H134.335V134.336H256z"
                      ></path>
                    </svg>
                    <span>Microsoft</span>
                  </Button>
                </Field>
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/$locale/login"
                    params={{ locale }}
                    className="hover:underline underline-offset-4 cursor-pointer text-primary"
                  >
                    Log in
                  </Link>
                </div>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
