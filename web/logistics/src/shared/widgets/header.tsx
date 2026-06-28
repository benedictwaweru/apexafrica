import { Link } from '@tanstack/react-router';
import { TextAlignJustify } from 'lucide-react';

import { Route } from '@/routes/$locale/_layout';

import { navLinks, navMoreLinks } from '@/shared/const/constants';

import { Button } from '@/shared/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/shared/ui/navigation-menu';

import { BlackLogo, WhiteLogo } from '@/shared/widgets/icons';
import { ThemeSwitch } from '@/shared/widgets/theme-switch';

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export function Header() {
  const { locale } = Route.useParams();

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex-1">
          <Link to="/" className="text-primary hover:text-primary/90">
            <WhiteLogo />
            <BlackLogo />
          </Link>
        </div>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navLinks.map((navLink) => (
              <NavigationMenuItem key={navLink.title}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link to={navLink.href}>{navLink.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger>More</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                  {navMoreLinks.map((navMoreLink) => (
                    <ListItem
                      key={navMoreLink.title}
                      title={navMoreLink.title}
                      href={navMoreLink.href}
                    >
                      {navMoreLink.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-2">
          <Button asChild variant="ghost" className="text-sm">
            <Link to="/$locale/login" params={{ locale }}>
              Log in
            </Link>
          </Button>
          <Button asChild className="text-sm">
            <Link to="/$locale/register" params={{ locale }}>
              Get started
            </Link>
          </Button>
          <ThemeSwitch />
        </div>

        <Button className="lg:hidden" variant="ghost" size="icon-lg">
          <TextAlignJustify />
        </Button>
      </div>
    </header>
  );
}
