// components/section-header.tsx
import * as React from "react";

import { cn } from "@/shared/lib/utils";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The section title, e.g. "Team members" */
  title: string;
  /** Optional supporting copy shown beneath the title */
  description?: string;
  /** Right-aligned actions — buttons, a button group, a search input, etc. */
  actions?: React.ReactNode;
  /** Optional full-width row rendered below title/description — tabs, a search bar, etc. */
  children?: React.ReactNode;
  /** Adds a bottom border, matching Untitled UI's default section header treatment */
  divider?: boolean;
}

export function SectionHeader({
  title,
  description,
  actions,
  children,
  divider = true,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 pb-4", divider && "border-b", className)}
      {...props}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        )}
      </div>

      {children}
    </div>
  );
}
