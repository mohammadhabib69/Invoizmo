'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  DollarSign, 
  FileText, 
  Users, 
  CheckCircle2,
  ArrowUpRight,
  Plus,
  BarChart3,
  UserPlus,
  TrendingUp,
  Activity,
  Calendar,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { analyticsDashboardStats, invoices } from '@/lib/mockData';

export default function DashboardPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,540',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-[#C8E600]',
      bg: 'bg-[#C8E600]/10',
    },
    {
      title: 'Active Clients',
      value: '18',
      change: '+5.1%',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Paid Invoices',
      value: '35',
      change: '83.3%',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Avg. Payment',
      value: '12d',
      change: '-2 days',
      icon: Calendar,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-primary">Overview</h1>
          <p className="text-muted-foreground mt-2 text-xl font-medium">Your business performance at a glance.</p>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/invoices/new">
            <Button className="bg-primary hover:bg-primary/90 text-white font-black h-14 px-8 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="w-5 h-5 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="border-border/50 shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300 rounded-[2rem] border-2 group overflow-hidden relative">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12", stat.bg)}>
                    <stat.icon className={cn("w-7 h-7", stat.color)} />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                  <h3 className="text-4xl font-black text-primary tracking-tighter">{stat.value}</h3>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#C8E600] transition-colors" />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Recent Invoices */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2 h-full">
            <CardHeader className="flex flex-row items-center justify-between p-10 border-b border-border/50">
              <div>
                <CardTitle className="text-2xl font-black text-primary">Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground font-bold mt-1">Latest billing events</p>
              </div>
              <Link href="/invoices">
                <Button variant="ghost" className="text-primary font-black hover:bg-tertiary rounded-xl px-6 h-12 border border-border/50">
                  View Ledger
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-8 hover:bg-tertiary/40 transition-all group cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-border/50 flex items-center justify-center font-black text-primary group-hover:border-[#C8E600] group-hover:bg-[#C8E600] group-hover:text-[#0f1117] transition-all">
                        {invoice.clientName[0]}
                      </div>
                      <div>
                        <p className="text-lg font-black text-primary group-hover:text-[#C8E600] transition-colors">{invoice.number}</p>
                        <p className="text-sm text-muted-foreground font-bold">{invoice.clientName}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-xl font-black text-primary">${invoice.amount.toLocaleString()}</p>
                      <span className={cn(
                        "text-[10px] px-4 py-1.5 rounded-full border-2 uppercase tracking-widest font-black transition-all",
                        invoice.status === 'Paid' 
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white" 
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white"
                      )}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Insights */}
        <motion.div variants={item} className="space-y-10">
          <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-[#0f1117] text-white p-10 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transform group-hover:scale-150 transition-transform duration-1000">
              <BarChart3 className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-2xl font-black">Velocity</h3>
                <p className="text-zinc-500 font-bold mt-1">Real-time pulse</p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#C8E600]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Drafts</p>
                    <p className="text-2xl font-black">4 Invoices</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">New Leads</p>
                    <p className="text-2xl font-black">3 Clients</p>
                  </div>
                </div>
              </div>

              <Link href="/analytics" className="block pt-6">
                <Button className="w-full h-14 bg-[#C8E600] text-[#0f1117] hover:bg-[#C8E600]/90 font-black rounded-2xl transition-all">
                  Full Insights
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] p-10 border-dashed bg-tertiary/20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-6">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-xl font-black text-primary">Expand your catalog</h4>
            <p className="text-sm font-medium text-muted-foreground mt-2 mb-8">
              Add more services or products to streamline your next invoice creation.
            </p>
            <Link href="/items" className="w-full">
              <Button variant="outline" className="w-full h-14 border-border font-black rounded-2xl hover:bg-primary hover:text-white transition-all">
                Add Items
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
