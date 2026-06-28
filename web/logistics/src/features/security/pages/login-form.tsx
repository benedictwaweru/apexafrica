import { Link, useParams } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';

import { BlackAfricaLogo, WhiteAfricaLogo } from '@/shared/widgets/icons';

import { loginStore } from '../store/login-store';
import { CredentialsForm } from '../ui/credentials-form';
import { OtpDialog } from '../ui/otp-dialog';

export function LoginPage() {
  const { locale } = useParams({ from: '/$locale/login/' });

  const stage = useSelector(loginStore, (s) => s.stage);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
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

        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Log in to your account
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <CredentialsForm locale={locale} />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1634638021403-70f46d19fc02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHN1cHBseSUyMGNoYWlufGVufDB8fDB8fHww"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/** MFA Dialog goes here */}
      {stage === 'mfa' && <OtpDialog locale={locale} />}
    </div>
  );
}
