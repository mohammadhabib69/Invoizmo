'use client';

import * as React from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  Search, 
  ChevronRight,
  Plus,
  ArrowUpRight,
  History,
  Calendar,
  Banknote,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { payments } from '@/lib/mockData';

export default function PaymentsPage() {
  const [activeMonth, setActiveMonth] = React.useState('All Time');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPayments = payments.filter(payment => 
    payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const averagePayment = totalCollected / payments.length;

  const stats = [
    { 
      title: 'Gross Revenue', 
      value: `$${totalCollected.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      title: 'Avg. Payment', 
      value: `$${averagePayment.toFixed(0)}`, 
      icon: Banknote, 
      color: 'text-[#C8E600]', 
      bg: 'bg-[#C8E600]/10' 
    },
    { 
      title: 'Active Invoices', 
      value: '12', 
      icon: Clock, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10' 
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Transaction History</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">Real-time tracking of your business cash flow.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border font-bold hover:bg-tertiary h-14 px-8 rounded-2xl">
             <History className="w-5 h-5 mr-2" />
             Logs
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-black h-14 px-10 rounded-2xl shadow-2xl shadow-primary/20">
            <Plus className="w-6 h-6 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-border shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 group overflow-hidden rounded-[2rem]">
              <CardContent className="p-8 flex items-center gap-6">
                <div className={cn("w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 group-hover:rotate-6", stat.bg)}>
                  <stat.icon className={cn("w-10 h-10", stat.color)} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.title}</p>
                  <p className="text-4xl font-black text-primary mt-1 tracking-tighter">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Timeline */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-primary flex items-center gap-3">
               <Calendar className="w-6 h-6 text-[#C8E600]" />
               Recent Transactions
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-11 h-11 bg-tertiary/50 border-transparent focus:bg-white focus:border-primary rounded-xl transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4 relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-[39px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent"></div>

            {filteredPayments.map((payment) => (
              <motion.div key={payment.id} variants={item} className="relative pl-24 group">
                {/* Timeline Dot */}
                <div className="absolute left-[31px] top-[26px] w-5 h-5 rounded-full border-4 border-white bg-primary group-hover:bg-[#C8E600] group-hover:scale-125 transition-all duration-500 z-10 shadow-xl shadow-primary/20"></div>
                
                <Card className="border-border group-hover:border-[#C8E600]/30 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:-translate-x-1 rounded-3xl overflow-hidden">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-tertiary/50 flex flex-col items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <span className="text-[10px] font-black uppercase text-muted-foreground group-hover:text-white/70">
                          {new Date(payment.date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black leading-none">{new Date(payment.date).getDate()}</span>
                      </div>
                      <div>
                        <p className="text-lg font-black text-primary group-hover:text-[#C8E600] transition-colors">{payment.clientName}</p>
                        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground mt-1">
                          <span className="uppercase tracking-widest">{payment.invoiceNumber}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                          <Badge variant="secondary" className="bg-tertiary text-primary border-none px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest">
                            {payment.method}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-500 group-hover:scale-110 transition-transform origin-right">+${payment.amount.toLocaleString()}</p>
                      <Button variant="ghost" size="sm" className="h-9 px-4 text-xs font-black text-muted-foreground hover:text-primary mt-2 rounded-xl group/btn">
                        View <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Quick Insights */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] bg-[#0f1117] text-white p-10">
             <div className="space-y-8">
               <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black">Revenue Pulse</h3>
                 <MoreVertical className="w-5 h-5 text-zinc-500" />
               </div>

               <div className="space-y-6">
                 {[
                   { label: 'Card Payments', percent: 65, color: 'bg-[#C8E600]' },
                   { label: 'Bank Transfers', percent: 25, color: 'bg-white' },
                   { label: 'Others', percent: 10, color: 'bg-zinc-700' },
                 ].map((item, idx) => (
                   <div key={idx} className="space-y-3">
                     <div className="flex justify-between text-xs font-black uppercase tracking-widest text-zinc-400">
                       <span>{item.label}</span>
                       <span>{item.percent}%</span>
                     </div>
                     <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className={cn("h-full rounded-full", item.color)} 
                       />
                     </div>
                   </div>
                 ))}
               </div>

               <div className="pt-8 border-t border-white/10">
                 <Button className="w-full h-14 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all">
                   Full Analytics
                   <ArrowUpRight className="w-5 h-5 ml-2" />
                 </Button>
               </div>
             </div>
           </Card>

           <Card className="border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] p-8 border-dashed bg-tertiary/20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center mx-auto">
                   <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-black text-primary">Need a detailed report?</h4>
                <p className="text-sm font-medium text-muted-foreground px-4">Generate and download comprehensive PDF statements for your accountants.</p>
                <Button variant="outline" className="w-full h-12 border-border font-black rounded-xl">
                  Download Statements
                </Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
