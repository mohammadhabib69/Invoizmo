'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreVertical,
  Calendar,
  Trash2,
  FileText,
  ArrowUpRight,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { invoices } from '@/lib/mockData';

export default function InvoicesPage() {
  const [activeStatus, setActiveStatus] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = activeStatus === 'All' || invoice.status === activeStatus;
    const matchesSearch = 
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Sent': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Overdue': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'Draft': return 'bg-neutral/10 text-neutral border-neutral/20';
      default: return 'bg-neutral/10 text-neutral border-neutral/20';
    }
  };

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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Invoices</h1>
          <p className="text-muted-foreground mt-1 text-lg">Track and manage your billing cycles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border font-bold hover:bg-tertiary h-12 px-6 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/invoices/new">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-xl shadow-primary/20">
              <Plus className="w-5 h-5 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="border-border shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
            <Tabs defaultValue="All" className="w-full lg:w-auto" onValueChange={setActiveStatus}>
              <TabsList className="bg-tertiary/50 p-1 rounded-xl h-12">
                {['All', 'Paid', 'Pending', 'Sent', 'Overdue', 'Draft'].map((status) => (
                  <TabsTrigger 
                    key={status} 
                    value={status}
                    className={cn(
                      "px-6 py-2 text-sm transition-all rounded-lg font-bold h-10",
                      activeStatus === status 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {status}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex w-full lg:w-auto items-center gap-3">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search number or client..." 
                  className="pl-11 h-12 bg-tertiary/30 border-transparent focus:bg-white focus:border-primary rounded-xl transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-12 w-12 border-border hover:bg-tertiary rounded-xl p-0">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-border shadow-2xl shadow-primary/5 overflow-hidden rounded-3xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-tertiary/30">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[140px] font-black text-primary h-16 pl-8 uppercase text-[11px] tracking-widest">Invoice #</TableHead>
                <TableHead className="font-black text-primary uppercase text-[11px] tracking-widest">Client</TableHead>
                <TableHead className="font-black text-primary uppercase text-[11px] tracking-widest">Amount</TableHead>
                <TableHead className="font-black text-primary uppercase text-[11px] tracking-widest text-center">Status</TableHead>
                <TableHead className="font-black text-primary uppercase text-[11px] tracking-widest">Date</TableHead>
                <TableHead className="text-right pr-8 font-black text-primary uppercase text-[11px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <motion.tr
                variants={container}
                initial="hidden"
                animate="show"
                className="contents"
              >
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow 
                      key={invoice.id} 
                      className="group border-tertiary hover:bg-tertiary/20 transition-all duration-300 cursor-pointer"
                    >
                      <TableCell className="pl-8 h-20">
                        <span className="font-black text-primary group-hover:text-[#C8E600] transition-colors">{invoice.number}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-black text-primary">{invoice.clientName}</span>
                          <span className="text-xs text-muted-foreground font-medium">{invoice.clientEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-lg font-black text-primary">${invoice.amount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge className={cn(
                            "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-none min-w-[100px] text-center",
                            getStatusColor(invoice.status)
                          )}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary">{invoice.date}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black">Issued</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <Link href={`/invoices/${invoice.id}`}>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-tertiary rounded-xl transition-all">
                              <Eye className="w-5 h-5" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-tertiary rounded-xl transition-all">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-tertiary/50 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-neutral" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-primary">No invoices found</p>
                          <p className="text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
                        </div>
                        <Button className="bg-primary text-white font-bold rounded-xl mt-2">
                          Clear Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </motion.tr>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
