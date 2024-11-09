'use client';

import { useLocation } from 'react-router-dom';

import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export function MainNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="mr-4 hidden md:flex">
      <a href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">test </span>
      </a>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <a
          href="/docs"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/docs' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Docs
        </a>
        <a
          href="/docs/components"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/docs/components') &&
              !pathname?.startsWith('/docs/component/chart')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Components
        </a>
        <a
          href="/blocks"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/blocks')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Blocks
        </a>
        <a
          href="/charts"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/docs/component/chart') ||
              pathname?.startsWith('/charts')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Charts
        </a>
        <a
          href="/themes"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/themes')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Themes
        </a>
        <a
          href="/examples"
          className={cn(
            'hidden transition-colors hover:text-foreground/80 lg:inline-block',
            pathname?.startsWith('/examples')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Examples
        </a>
        <a
          href="/colors"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/colors')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Colors
        </a>
      </nav>
    </div>
  );
}
