import { Link, createFileRoute } from '@tanstack/react-router';
import {
  BadgeCheck,
  Binoculars,
  ChartSpline,
  CirclePile,
  FolderKanban,
  Route as RouteIcon,
} from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';

import { faqItems } from '@/shared/const/constants';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Button } from '@/shared/ui/button';

export const Route = createFileRoute('/$locale/_layout/')({
  component: Homepage,
});

function Homepage() {
  const { locale } = Route.useParams();

  return (
    <div className="flex flex-col mx-auto max-w-7xl px-6 pt-10 pb-24 sm:px-6 sm:pb-32 lg:px-8 lg:py-32 lg:pb-48">
      <div className="mx-auto lg:pt-8">
        {/* <WhatsNew locale={locale} /> */}
        <h1 className="mt-10 text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl 2xl:text-9xl">
          Reduce costs. Increase reliability. Scale with confidence.
        </h1>
        <p className="mt-6 max-w-lg text-md leading-8 text-foreground">
          Connecting shippers, carriers and warehouse operators through a
          unified platform for seamless intercity freight.
        </p>
        <div className="mx-auto mt-10 flex items-center gap-x-6 text-center">
          <Button>
            <Link to="/$locale/register" params={{ locale }}>
              Get Started
            </Link>
          </Button>
          <Button variant="ghost">
            <Link to="/$locale/login" params={{ locale }}>
              Log in
            </Link>
          </Button>
        </div>
      </div>

      {/** Stats Section */}
      {/* <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-16">
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
            <h2 className="text-4xl font-bold lg:text-5xl">
              Apex Africa in numbers
            </h2>
            <p>
              Trusted by logistics teams across Africa to streamline operations,
              reduce overhead, and keep freight moving — at any scale.
            </p>
          </div>

          <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
            <div className="flex justify-center items-center">
              <RatingBadge
                rating={5}
                title={formatCount(1200)}
                subtitle="Active Routes"
              />
            </div>
            <div className="flex justify-center items-center">
              <RatingBadge
                rating={5}
                title={formatCount(1200000)}
                subtitle="Shipments Processed"
              />
            </div>
            <div className="flex justify-center items-center">
              <RatingBadge
                rating={5}
                title={formatCount(1200)}
                subtitle="Transaction Volume"
              />
            </div>
          </div>
        </div>
      </section> */}

      {/** Features Section */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
            <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
              <h1 className="text-balance text-4xl font-bold lg:text-5xl">
                The foundation for streamlined logistics operations
              </h1>
              <p>
                At Apex Africa, we strive to deliver efficient, reliable, and
                scalable logistics solutions, continuously innovating to meet
                the evolving needs of our clients while promoting sustainability
                and integrity.
              </p>
            </div>

            <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FolderKanban className="size-4" />
                  <h3 className="text-sm font-medium">
                    One Platform. Every Role.
                  </h3>
                </div>
                <p className="text-sm">
                  Shippers, carriers, and fleet managers — each with their own
                  dashboards, permissions, and controls.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Binoculars className="size-4" />
                  <h3 className="text-sm font-medium">Tracking</h3>
                </div>
                <p className="text-sm">
                  Monitor shipment progress in real-time with status updates and
                  location tracking.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CirclePile className="size-4" />
                  <h3 className="text-sm font-medium">Inventory Management</h3>
                </div>
                <p className="text-sm">
                  Track stock levels, movements, and replenishment across
                  warehouses.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RouteIcon className="size-4" />
                  <h3 className="text-sm font-medium">Route Optimization</h3>
                </div>
                <p className="text-sm">
                  Reduce transit times and fuel costs with intelligent routing
                  built for Africa's intercity road networks.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-4" />
                  <h3 className="text-sm font-medium">
                    Verified Carriers Only
                  </h3>
                </div>
                <p className="text-sm">
                  Every carrier on our platform is vetted and credentialed. No
                  unverified operators. No surprises.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ChartSpline className="size-4" />
                  <h3 className="text-sm font-medium">Built to Scale</h3>
                </div>
                <p className="text-sm">
                  From a single truck to a full fleet, Apex Africa grows with
                  your operation — with strong controls, security, and audit
                  trails.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/** Install mobile app section */}
      {/* <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center my-4 md:my-12 md:space-y-12">
            <h1 className="text-balance text-3xl font-bold lg:text-5xl">
              Download the App
            </h1>
          </div>
          <div className="flex flex-col gap-10 md:flex-row md:gap-16">
            <div className="md:w-1/3">
              <Iphone src="https://plus.unsplash.com/premium_photo-1673513508497-bab3caca8221?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </div>
            <div className="md:w-2/3 flex flex-col justify-center items-center space-y-24">
              <div className="flex justify-center items-center space-x-4">
                <QRCode value="https://binance.com" className="" size="lg" />
                <h2 className="text-muted-foreground text-xl">
                  Scan to download the app
                </h2>
              </div>
              <div className="flex items-start gap-3 flex-row">
                <GooglePlayButton size="md" />
                <AppStoreButton size="md" />
                <GalaxyStoreButton size="md" />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/** FAQs */}
      <section className="bg-muted dark:bg-background py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="flex flex-col gap-10 md:flex-row md:gap-16">
            <div className="md:w-1/3">
              <div className="sticky top-20">
                <h2 className="mt-4 text-3xl font-bold">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground mt-4">
                  Can't find what you're looking for? Contact our{' '}
                  <Link
                    to="/$locale/support"
                    params={{ locale }}
                    className="text-primary font-medium hover:underline underline-offset-4"
                  >
                    customer support team
                  </Link>
                </p>
              </div>
            </div>
            <div className="md:w-2/3">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqItems.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                  >
                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex size-6">
                          <DynamicIcon
                            name={item.icon}
                            className="m-auto size-4"
                          />
                        </div>
                        <span className="text-base">{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5">
                      <div className="px-9">
                        <p className="text-base">{item.answer}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/** CTA */}
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
              Ready to move freight smarter?
            </h2>
            <p className="mt-4">
              Join thousands of shippers and carriers already running on Apex
              Africa.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Button asChild className="text-sm">
                <Link to="/$locale/register" params={{ locale }}>
                  Get Started
                </Link>
              </Button>

              <Button asChild variant="outline" className="text-sm">
                <Link to="/$locale/login" params={{ locale }}>
                  Log in
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
