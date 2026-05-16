import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[300px]", className)}>
      <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-zinc-300" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      
      {actionLabel && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button 
            className="bg-primary text-black hover:bg-primary/90 font-bold"
            onClick={actionOnClick}
          >
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
