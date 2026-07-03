import { useState } from 'react';

import { Cookie } from 'lucide-react';

import type { CookieConsentSchema } from '@/shared/schemas/cookie-consent-schema';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Switch } from '@/shared/ui/switch';

interface CookieBannerProps {
  onDecision: (accepted: boolean) => void;
}

function CookieBanner({ onDecision }: CookieBannerProps) {
  const [draftConsent, setDraftConsent] = useState<CookieConsentSchema>({
    isAccepted: undefined,
    cookieType: {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    },
    timestamp: undefined,
  });

  const persist = (consent: CookieConsentSchema) => {
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    onDecision(consent.isAccepted === true);
  };

  const acceptAll = () =>
    persist({
      isAccepted: true,
      cookieType: {
        essential: true,
        analytics: true,
        functional: true,
        marketing: true,
      },
      timestamp: new Date().toISOString(),
    });

  const declineAll = () =>
    persist({
      isAccepted: false,
      cookieType: {
        essential: true,
        analytics: false,
        functional: false,
        marketing: false,
      },
      timestamp: new Date().toISOString(),
    });

  return (
    <div className="bg-background fixed inset-x-8 bottom-4 z-50 rounded-md border px-4 py-3 shadow-lg">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Cookie />
          <p className="text-sm">
            We use cookies to improve your experience, analyze site usage, and
            show personalized content.
          </p>
        </div>

        <div className="flex gap-2 max-md:flex-wrap">
          <Button className="cursor-pointer" size="sm" onClick={acceptAll}>
            Accept All
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" size="sm">
                Manage
              </Button>
            </DialogTrigger>
            <DialogContent
              aria-describedby=""
              showCloseButton={false}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>Cookie Preferences</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex max-w-xs flex-col">
                  <h3 className="text-sm font-semibold">Essential Cookies</h3>
                  <p className="text-xs">
                    These cookies are necessary for the website to function
                    properly. They enable basic features like page navigation,
                    secure login, and viewings. The site cannot function
                    correctly without them.
                  </p>
                </div>
                <Switch checked={draftConsent.cookieType.essential} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex max-w-xs flex-col">
                  <h3 className="text-sm font-semibold">
                    Performance & Analytics Cookies
                  </h3>
                  <p className="text-xs">
                    These cookies help us understand how visitors use the
                    website by collecting anonymous information. They allow us
                    to improve site performance, fix issues, and provide a
                    better browsing experience.
                  </p>
                </div>
                <Switch
                  className="cursor-pointer"
                  checked={draftConsent.cookieType.analytics}
                  onCheckedChange={(value) =>
                    setDraftConsent((prev) => ({
                      ...prev,
                      cookieType: { ...prev.cookieType, analytics: value },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex max-w-xs flex-col">
                  <h3 className="text-sm font-semibold">Functional Cookies</h3>
                  <p className="text-xs">
                    These cookies remember your preferences and choices, such as
                    language, region, or display settings. They make your
                    experience more personalized and convenient.
                  </p>
                </div>
                <Switch
                  className="cursor-pointer"
                  checked={draftConsent.cookieType.functional}
                  onCheckedChange={(value) =>
                    setDraftConsent((prev) => ({
                      ...prev,
                      cookieType: { ...prev.cookieType, functional: value },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex max-w-xs flex-col">
                  <h3 className="text-sm font-semibold">
                    Advertising & Marketing Cookies
                  </h3>
                  <p className="text-xs">
                    These cookies are used to deliver relevant ads and track the
                    effectiveness of our marketing campaigns. They may also be
                    set by third-party advertisers to build a profile of your
                    interests.
                  </p>
                </div>
                <Switch
                  className="cursor-pointer"
                  checked={draftConsent.cookieType.marketing}
                  onCheckedChange={(value) =>
                    setDraftConsent((prev) => ({
                      ...prev,
                      cookieType: { ...prev.cookieType, marketing: value },
                    }))
                  }
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="cursor-pointer" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    className="cursor-pointer"
                    type="submit"
                    onClick={() =>
                      persist({
                        ...draftConsent,
                        isAccepted: true,
                        timestamp: new Date().toISOString(),
                        cookieType: {
                          essential: true,
                          analytics: draftConsent.cookieType.analytics,
                          functional: draftConsent.cookieType.functional,
                          marketing: draftConsent.cookieType.marketing,
                        },
                      })
                    }
                  >
                    Save preferences
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={declineAll}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}

function getCookieConsent(key: string) {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as CookieConsentSchema) : null;
}

export function CookieConsentWrapper() {
  const [accepted, setAccepted] = useState<boolean | undefined>(
    getCookieConsent('cookieConsent')?.isAccepted,
  );

  if (accepted === undefined) return <CookieBanner onDecision={setAccepted} />;

  return null;
}
