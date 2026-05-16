'use client';

import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuth } from '@/auth/AuthProvider';
import { MobileMenu } from './MobileMenu';

export function Topbar() {
  const { user } = useAuth();

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center">
        <MobileMenu />
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle variant="compact" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {user?.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
