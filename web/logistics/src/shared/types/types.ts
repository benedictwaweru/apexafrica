import type { QueryClient } from '@tanstack/react-query';
import type { LucideProps } from 'lucide-react';

export interface RouterContext {
  queryClient: QueryClient;
}

export interface User {
  id: string;
  name: string;
  username: string;
  roles: Array<string>;
  avatarUrl?: string;
}

export type ResponseType = {
  message: string;
};

export type SidebarUser = Omit<User, 'id' | 'roles'>;

export type SidebarNavigationBar = {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  isActive: boolean;
};
