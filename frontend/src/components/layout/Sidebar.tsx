'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
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

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: FileText,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Items',
    href: '/items',
    icon: Package,
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: CreditCard,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="hidden lg:flex w-72 border-r border-white/5 bg-[#0f1117] text-white h-screen flex-col sticky top-0 shadow-2xl">
      <div className="p-8">
        <Logo size="lg" showText={false} />
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden',
                isActive 
                  ? 'bg-[#C8E600] text-[#0f1117] font-bold shadow-[0_10px_20px_rgba(200,230,0,0.15)]' 
                  : 'text-neutral hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[#0f1117]" : "text-[#847991] group-hover:text-white")} />
              <span className="text-sm tracking-tight">{item.title}</span>
              {isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#0f1117]/10" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-white/5">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl text-[#847991] hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}
