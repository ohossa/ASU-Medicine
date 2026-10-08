import { ChevronRight } from 'lucide-react';

export interface FlowCrumb { label: string; onClick?: () => void }

/** Scrollable, keyboard-accessible ancestors shared by the GIT study flow. */
export function FlowBreadcrumbs({ crumbs, rtl = false, onNavigate }: {
  crumbs: FlowCrumb[];
  rtl?: boolean;
  onNavigate?: (action: () => void) => void;
}) {
  return <ol className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-xs font-medium text-muted-foreground dark:text-white/50">
    {crumbs.map((crumb, index) => <li key={`${index}-${crumb.label}`} className="flex shrink-0 items-center gap-1">
      {index > 0 && <ChevronRight aria-hidden size={13} className={`opacity-50 ${rtl ? 'rotate-180' : ''}`} />}
      {crumb.onClick ? <button type="button" onClick={() => onNavigate ? onNavigate(crumb.onClick!) : crumb.onClick!()}
        className="rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary active:scale-95 dark:hover:text-white cursor-pointer">
        {crumb.label}
      </button> : <span aria-current={index === crumbs.length - 1 ? 'page' : undefined}
        className="px-2 py-1.5 font-semibold text-foreground dark:text-white/85">{crumb.label}</span>}
    </li>)}
  </ol>;
}
