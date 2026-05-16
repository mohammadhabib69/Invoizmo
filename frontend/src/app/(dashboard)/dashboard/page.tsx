'use client';

import * as React from 'react';
import { 
  DollarSign, 
  FileText, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  ArrowUpRight,
  Calendar,
  MoreVertical,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { invoices, clients, analyticsData } from '@/lib/mockData';

export default function DashboardPage() {
  const kpiStats = [
    {
      title: 'Total Revenue',
      value: `$${analyticsData.monthlyRevenue.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-[#C8E600]',
      bg: 'bg-[#C8E600]/10',
      trend: 'up'
    },
    {
      title: 'Invoices Sent',
      value: invoices.length.toString(),
      change: '+8.2%',
      icon: FileText,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      trend: 'up'
    },
    {
      title: 'Active Clients',
      value: clients.length.toString(),
      change: '+5.1%',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      trend: 'up'
    },
    {
      title: 'Paid Ratio',
      value: '83.3%',
      change: '+2.4%',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      trend: 'up'
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Overview</h1>
          <p className="text-muted-foreground mt-1 text-lg">Welcome back! Here's your business at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-border font-bold hover:bg-tertiary h-12 px-6 rounded-xl">
             <Calendar className="w-4 h-4 mr-2" />
             May 2024
           </Button>
           <Link href="/invoices/new">
             <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-xl shadow-primary/20">
               <Plus className="w-5 h-5 mr-2" />
               New Invoice
             </Button>
           </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border shadow-xl shadow-primary/5 relative overflow-hidden group hover:border-[#C8E600] transition-colors duration-300 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
                <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-primary">{stat.value}</div>
                <div className="flex items-center gap-1.5 mt-2">
                   <div className={cn(
                     "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black",
                     stat.trend === 'up' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                   )}>
                     <TrendingUp className="w-3 h-3" />
                     {stat.change}
                   </div>
                   <span className="text-xs text-muted-foreground font-medium">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border shadow-2xl shadow-primary/5 overflow-hidden rounded-3xl">
          <CardHeader className="border-b border-tertiary py-6 px-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-primary">Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground font-medium">Your latest 5 invoices and updates</p>
              </div>
              <Link href="/invoices">
                <Button variant="ghost" className="text-primary font-bold hover:bg-tertiary rounded-xl">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-tertiary">
              {invoices.slice(0, 5).map((invoice, idx) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.05) }}
                >
                  <Link href={`/invoices/${invoice.id}`}>
                    <div className="flex items-center justify-between p-6 hover:bg-tertiary/50 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-tertiary flex items-center justify-center text-primary group-hover:bg-[#C8E600] group-hover:text-[#0f1117] transition-all duration-500 shadow-inner">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-black text-primary group-hover:translate-x-1 transition-transform duration-300">{invoice.number}</p>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                            <p className="text-xs font-bold text-muted-foreground">{invoice.date}</p>
                          </div>
                          <p className="text-sm text-neutral font-bold mt-0.5">{invoice.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                          <p className="text-lg font-black text-primary">${invoice.amount.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Gross Amount</p>
                        </div>
                        <div className={cn(
                          "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm min-w-[90px] text-center transition-all group-hover:scale-105",
                          invoice.status === 'Paid' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          invoice.status === 'Pending' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                          invoice.status === 'Overdue' ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                          "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        )}>
                          {invoice.status}
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border shadow-2xl shadow-primary/5 overflow-hidden rounded-3xl bg-[#0f1117] text-white">
            <CardHeader className="py-6 px-8 border-b border-white/5">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#C8E600]" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <Link href="/invoices/new" className="block">
                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-[#C8E600] hover:text-[#0f1117] transition-all duration-300 group text-left border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#0f1117]/10 transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="font-black tracking-tight">Create Invoice</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                </button>
              </Link>
              <Link href="/clients" className="block">
                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white hover:text-[#0f1117] transition-all duration-300 group text-left border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#0f1117]/10 transition-colors">
                      <Users className="w-5 h-5 text-[#C8E600]" />
                    </div>
                    <span className="font-black tracking-tight">New Client</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                </button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden group">
            <div className="p-8 bg-gradient-to-br from-[#C8E600] to-[#E2FB3A] text-[#0f1117]">
              <h3 className="text-2xl font-black tracking-tight">Go Unlimited</h3>
              <p className="text-sm font-bold opacity-80 mt-1">Upgrade to Pro for unlimited invoices and advanced features.</p>
              <Button className="mt-6 w-full bg-[#0f1117] text-white hover:bg-[#0f1117]/90 font-black h-12 rounded-2xl shadow-xl">
                Upgrade Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
