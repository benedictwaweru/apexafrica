'use client';

import type { SVGProps } from 'react';

import AfricaWhite from '@/shared/assets/images/africa-continent-white.svg';
import AfricaBlack from '@/shared/assets/images/africa-continent.svg';
import AmexLogo from '@/shared/assets/images/amex-logo.svg';
import DiscoverLogo from '@/shared/assets/images/discover-logo.svg';
import error404 from '@/shared/assets/images/error404.svg';
import LogoBlack from '@/shared/assets/images/logo-black.svg';
import LogoWhite from '@/shared/assets/images/logo-white.svg';
import VisaBlackLogo from '@/shared/assets/images/visa-logo-black.svg';
import VisaWhiteLogo from '@/shared/assets/images/visa-logo-white.svg';

import { cn } from '@/shared/lib/utils';

/** Company logo variations */
export function BlackLogo() {
  return <img src={LogoBlack} alt="Logo" className="h-8 dark:hidden" />;
}

export function WhiteLogo() {
  return (
    <img src={LogoWhite} alt="Logo" className="hidden dark:block dark:h-8" />
  );
}

export function WhiteAfricaLogo({ className }: { className?: string }) {
  return (
    <img
      src={AfricaWhite}
      alt="Africa"
      className={cn('hidden dark:block dark:h-8', className)}
    />
  );
}

export function BlackAfricaLogo({ className }: { className?: string }) {
  return (
    <img
      src={AfricaBlack}
      alt="Africa"
      className={cn('h-8 dark:hidden', className)}
    />
  );
}

/**
 * Payment network logos
 */
export function Visa() {
  return (
    <>
      <img src={VisaBlackLogo} alt="Visa" className="h-6 dark:hidden" />
      <img src={VisaWhiteLogo} alt="Visa" className="hidden h-6 dark:block" />
    </>
  );
}

export function Mastercard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="30" height="19" viewBox="0 0 30 19" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4393C13.3266 17.77 11.2787 18.5733 9.04092 18.5733C4.04776 18.5733 0 14.5737 0 9.64C0 4.70625 4.04776 0.706665 9.04092 0.706665C11.2787 0.706665 13.3266 1.51 14.9053 2.84072C16.484 1.51 18.5319 0.706665 20.7697 0.706665C25.7629 0.706665 29.8106 4.70625 29.8106 9.64C29.8106 14.5737 25.7629 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.77 14.9053 16.4393Z"
        fill="#ED0006"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4393C16.8492 14.8007 18.0818 12.3626 18.0818 9.64C18.0818 6.91739 16.8492 4.47925 14.9053 2.84072C16.484 1.50999 18.5319 0.706665 20.7697 0.706665C25.7628 0.706665 29.8106 4.70625 29.8106 9.64C29.8106 14.5737 25.7628 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.77 14.9053 16.4393Z"
        fill="#F9A000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4393C16.8492 14.8008 18.0818 12.3627 18.0818 9.64007C18.0818 6.91748 16.8492 4.47936 14.9053 2.84082C12.9614 4.47936 11.7288 6.91748 11.7288 9.64007C11.7288 12.3627 12.9614 14.8008 14.9053 16.4393Z"
        fill="#FF5E00"
      />
    </svg>
  );
}

export function MastercardWhite(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="30" height="19" viewBox="0 0 30 19" fill="none" {...props}>
      <path
        opacity="0.5"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4392C13.3266 17.7699 11.2787 18.5733 9.04092 18.5733C4.04776 18.5733 0 14.5737 0 9.63994C0 4.70619 4.04776 0.706604 9.04092 0.706604C11.2787 0.706604 13.3266 1.50993 14.9053 2.84066C16.484 1.50993 18.5319 0.706604 20.7697 0.706604C25.7629 0.706604 29.8106 4.70619 29.8106 9.63994C29.8106 14.5737 25.7629 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.7699 14.9053 16.4392Z"
        fill="white"
      />
      <path
        opacity="0.5"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4392C16.8492 14.8007 18.0818 12.3625 18.0818 9.63994C18.0818 6.91733 16.8492 4.47919 14.9053 2.84066C16.484 1.50993 18.5319 0.706604 20.7697 0.706604C25.7628 0.706604 29.8106 4.70619 29.8106 9.63994C29.8106 14.5737 25.7628 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.7699 14.9053 16.4392Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4392C16.8492 14.8007 18.0818 12.3625 18.0818 9.63995C18.0818 6.91736 16.8492 4.47924 14.9053 2.8407C12.9614 4.47924 11.7288 6.91736 11.7288 9.63995C11.7288 12.3625 12.9614 14.8007 14.9053 16.4392Z"
        fill="white"
      />
    </svg>
  );
}

export function AmericanExpress() {
  return <img src={AmexLogo} alt="Amex" className="h-6" />;
}

export function Discover() {
  return <img src={DiscoverLogo} alt="Discover" className="h-6" />;
}

export const PaypassIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" {...props}>
      <g clipPath="url(#clip0_1307_7682)">
        <path
          d="M15.1429 1.28571C17.0236 4.54326 18.0138 8.23849 18.0138 12C18.0138 15.7615 17.0236 19.4567 15.1429 22.7143M10.4286 3.64285C11.8956 6.18374 12.6679 9.06602 12.6679 12C12.6679 14.934 11.8956 17.8162 10.4286 20.3571M5.92859 5.80713C6.98933 7.66394 7.54777 9.77022 7.54777 11.9143C7.54777 14.0583 6.98933 16.1646 5.92859 18.0214M1.42859 8.14285C2.19306 9.29983 2.59834 10.6362 2.59834 12C2.59834 13.3638 2.19306 14.7002 1.42859 15.8571"
          stroke="currentColor"
          strokeWidth="2.57143"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1307_7682">
          <rect width="20" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export function Error404() {
  return <img src={error404} alt="Error 404" className="size-100" />;
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('w-4 h-4', className)}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>WhatsApp</title>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}
