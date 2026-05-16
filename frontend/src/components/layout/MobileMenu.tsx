'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '@/auth/AuthProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const sidebarItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Invoices', href: '/invoices', icon: FileText },
  { title: 'Clients', href: '/clients', icon: Users },
  { title: 'Items', href: '/items', icon: Package },
  { title: 'Payments', href: '/payments', icon: CreditCard },
  { title: 'Analytics', href: '/analytics', icon: BarChart3 },
  { title: 'Settings', href: '/settings', icon: Settings },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon" onClick={toggle} className="text-neutral">
        <Menu className="w-6 h-6" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-[280px] bg-primary text-primary-foreground z-[101] p-6 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" showText={false} />
          <Button variant="ghost" size="icon" onClick={toggle} className="text-primary-foreground">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200',
                  isActive 
                    ? 'bg-secondary text-white font-bold' 
                    : 'text-neutral hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-neutral")} />
                <span className="text-lg">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button
            onClick={() => { logout(); setIsOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-4 rounded-xl text-neutral hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-lg font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
