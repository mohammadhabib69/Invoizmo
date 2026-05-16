'use client';

import * as React from 'react';
import { 
  Calendar,
  ArrowUpRight,
  DollarSign,
  Users,
  FileCheck,
  TrendingUp,
  TrendingDown,
  BarChart3,
  SearchX,
  FileText,
  Activity,
  ArrowDownRight,
  MousePointerClick
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  BarChart, 
  Bar 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { EmptyState } from '@/components/ui/EmptyState';
import { analyticsDashboardStats } from '@/lib/mockData';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  // Using mock data directly as per plan
  const stats = analyticsDashboardStats;
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const kpis = [
    { 
      title: 'Total Revenue', 
      value: `$${stats.kpis.totalRevenue.toLocaleString()}`, 
      trend: '+12.5%', 
      isUp: true, 
      icon: DollarSign, 
      color: 'text-[#C8E600]', 
      bg: 'bg-[#C8E600]/10' 
    },
    { 
      title: 'Active Clients', 
      value: stats.kpis.totalClients.toString(), 
      trend: '+4.2%', 
      isUp: true, 
      icon: Users, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10' 
    },
    { 
      title: 'Paid Invoices', 
      value: stats.kpis.totalPaidInvoices.toString(), 
      trend: '+18%', 
      isUp: true, 
      icon: FileCheck, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10' 
    },
    { 
      title: 'Avg. Payment', 
      value: `${stats.kpis.avgPaymentDays} days`, 
      trend: '-2 days', 
      isUp: false, 
      icon: Calendar, 
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10' 
    },
  ];

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

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Business Intelligence</h1>
          <p className="text-muted-foreground mt-1 text-lg font-medium">Deep dive into your revenue, clients and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 border-border font-bold rounded-2xl hover:bg-tertiary">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-black rounded-2xl shadow-xl shadow-primary/20">
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div key={idx} variants={item}>
            <Card className="border-border/50 shadow-xl shadow-primary/5 overflow-hidden relative group hover:shadow-primary/10 transition-all duration-300 rounded-[2rem] border-2 hover:border-primary/20">
              <CardContent className="p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110", kpi.bg)}>
                    <kpi.icon className={cn("w-7 h-7", kpi.color)} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider",
                    kpi.isUp ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  )}>
                    {kpi.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{kpi.title}</p>
                <h3 className="text-3xl font-black text-primary mt-1">{kpi.value}</h3>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-transparent group-hover:bg-[#C8E600] transition-colors"></div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2">
            <CardHeader className="flex flex-row items-center justify-between py-10 px-10">
              <div>
                <CardTitle className="text-2xl font-black text-primary">Revenue Velocity</CardTitle>
                <p className="text-sm text-muted-foreground font-bold mt-1">Net income over the last 6 months</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                  <div className="w-3 h-3 rounded-full bg-[#C8E600] shadow-[0_0_10px_rgba(200,230,0,0.5)]"></div>
                  <span>Revenue</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] pb-10 pr-10 pl-4 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8E600" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C8E600" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#787677', fontSize: 12, fontWeight: 800 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#787677', fontSize: 12, fontWeight: 800 }}
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: '2px solid #0f1117', 
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                      padding: '16px 20px',
                      fontWeight: '900',
                      backgroundColor: '#fff'
                    }}
                    cursor={{ stroke: '#C8E600', strokeWidth: 3 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#0f1117" 
                    strokeWidth={5}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div variants={item}>
          <Card className="h-full border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2">
            <CardHeader className="py-10 px-10">
              <CardTitle className="text-2xl font-black text-primary">Status Mix</CardTitle>
              <p className="text-sm text-muted-foreground font-bold mt-1">Invoice lifecycle breakdown</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-10 pt-0">
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {stats.statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-primary">100%</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Total Flow</span>
                </div>
              </div>
              <div className="space-y-3 w-full mt-10">
                {stats.statusBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-tertiary/20 hover:bg-tertiary transition-all group">
                    <div className="w-3 h-3 rounded-full shadow-sm group-hover:scale-125 transition-transform" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{item.name}</span>
                    <span className="text-sm font-black text-primary ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Clients Bar Chart */}
        <motion.div variants={item}>
          <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2">
            <CardHeader className="py-10 px-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-primary">Top Contributors</CardTitle>
                  <p className="text-sm text-muted-foreground font-bold mt-1">Clients generating the most revenue</p>
                </div>
                <Users className="w-8 h-8 text-primary/10" />
              </div>
            </CardHeader>
            <CardContent className="h-[400px] p-10 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topClients} layout="vertical" margin={{ left: 20, right: 20, top: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#0f1117', fontSize: 13, fontWeight: 900 }}
                    width={130}
                  />
                  <Tooltip 
                     cursor={{fill: 'rgba(200,230,0,0.1)', radius: 12}}
                     contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#0f1117" 
                    radius={[0, 15, 15, 0]} 
                    barSize={45}
                  >
                    {stats.topClients.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#0f1117' : '#27272a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item}>
          <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2">
            <CardHeader className="flex flex-row items-center justify-between py-10 px-10 border-b border-border/50">
              <div>
                <CardTitle className="text-2xl font-black text-primary">Pulse Feed</CardTitle>
                <p className="text-sm text-muted-foreground font-bold mt-1">Live updates from your business</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-black hover:bg-tertiary rounded-xl px-5 h-10 border border-border/50">
                <Activity className="w-4 h-4 mr-2" />
                History
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto custom-scrollbar">
                {stats.recentActivity.map((activity, idx) => (
                  <div key={idx} className="p-7 flex items-center justify-between hover:bg-tertiary/40 transition-all group cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110",
                        activity.warning ? "bg-rose-500 shadow-rose-500/20" : "bg-white border-2 border-border/50 group-hover:border-primary/20"
                      )}>
                        {activity.type === 'Payment' && <DollarSign className="w-7 h-7 text-emerald-600" />}
                        {activity.type === 'Invoice' && (
                          activity.warning ? <ArrowDownRight className="w-7 h-7 text-white" /> : <FileText className="w-7 h-7 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className={cn(
                          "text-base font-black leading-tight transition-colors",
                          activity.warning ? "text-rose-600" : "text-primary group-hover:text-primary"
                        )}>{activity.desc}</p>
                        <p className="text-[10px] font-black text-neutral mt-1.5 uppercase tracking-[0.15em]">
                          {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="text-right flex flex-col items-end">
                        <span className={cn(
                          "text-xl font-black", 
                          activity.type === 'Payment' ? "text-emerald-600" : "text-primary"
                        )}>
                          {activity.amount}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <span className="text-[10px] font-black text-muted-foreground uppercase">Details</span>
                          <ArrowUpRight className="w-3 h-3 text-neutral" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-6 bg-tertiary/20 flex justify-center">
                <Button variant="link" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  <MousePointerClick className="w-3 h-3 mr-2" />
                  Load more activities
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

