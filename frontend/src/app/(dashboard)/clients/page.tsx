'use client';

import * as React from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Mail, 
  Building2, 
  ArrowUpRight,
  Trash2,
  Pencil,
  Phone,
  Globe,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { clients } from '@/lib/mockData';

export default function ClientsPage() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Clients</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your customer database and relationships.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border font-bold hover:bg-tertiary h-12 px-6 rounded-xl">
             <Star className="w-4 h-4 mr-2" />
             Favorites
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-xl shadow-primary/20">
            <Plus className="w-5 h-5 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="border-border shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or company..." 
                className="pl-11 h-12 bg-tertiary/30 border-transparent focus:bg-white focus:border-primary rounded-xl transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 bg-tertiary/50 p-1 rounded-xl">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-10 px-6 rounded-lg transition-all font-bold", 
                  view === 'grid' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setView('grid')}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-10 px-6 rounded-lg transition-all font-bold", 
                  view === 'list' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setView('list')}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredClients.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-tertiary rounded-3xl">
            <Building2 className="w-12 h-12 text-neutral mx-auto mb-4" />
            <h3 className="text-xl font-black text-primary">No clients found</h3>
            <p className="text-muted-foreground font-medium">Try adjusting your search or add a new client to get started.</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <motion.div key={client.id} variants={item}>
                <Card className="group border-border hover:border-[#C8E600] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer overflow-hidden rounded-3xl">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl transform group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundColor: client.color || '#0f1117' }}
                      >
                        {getInitials(client.name)}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-tertiary rounded-xl">
                          <Pencil className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-8">
                      <h3 className="text-2xl font-black text-primary tracking-tight group-hover:text-[#C8E600] transition-colors">{client.name}</h3>
                      <div className="flex items-center text-sm font-bold text-neutral">
                        <Building2 className="w-4 h-4 mr-2" />
                        {client.company}
                      </div>
                      <div className="flex items-center text-sm font-bold text-neutral">
                        <Mail className="w-4 h-4 mr-2" />
                        {client.email}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-6 border-t border-tertiary">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Total Invoiced</p>
                        <p className="text-xl font-black text-primary">${client.totalInvoiced.toLocaleString()}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Invoices</p>
                        <p className="text-xl font-black text-primary">{client.invoiceCount}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button variant="outline" className="w-full h-12 border-border font-black rounded-2xl group-hover:bg-[#0f1117] group-hover:text-white transition-all duration-300">
                        Client Portal
                        <ArrowUpRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-border overflow-hidden shadow-2xl shadow-primary/5 rounded-3xl">
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-tertiary/30 border-b border-border">
                  <tr>
                    <th className="px-8 py-5 font-black text-primary uppercase text-[11px] tracking-widest">Client</th>
                    <th className="px-8 py-5 font-black text-primary uppercase text-[11px] tracking-widest">Email</th>
                    <th className="px-8 py-5 font-black text-primary uppercase text-[11px] tracking-widest text-center">Projects</th>
                    <th className="px-8 py-5 font-black text-primary uppercase text-[11px] tracking-widest text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tertiary">
                  {filteredClients.map((client) => (
                    <motion.tr 
                      key={client.id} 
                      variants={item}
                      className="group hover:bg-tertiary/20 transition-all duration-300 cursor-pointer"
                    >
                      <td className="px-8 py-5 h-20">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg"
                            style={{ backgroundColor: client.color || '#0f1117' }}
                          >
                            {getInitials(client.name)}
                          </div>
                          <div>
                            <p className="font-black text-primary group-hover:text-[#C8E600] transition-colors">{client.name}</p>
                            <p className="text-xs font-bold text-muted-foreground">{client.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-sm font-bold text-neutral">{client.email}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <Badge className="bg-tertiary text-primary border-none font-black px-4 py-1 rounded-lg">
                           {client.invoiceCount}
                         </Badge>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex items-center justify-end gap-6">
                           <span className="text-lg font-black text-primary">${client.totalInvoiced.toLocaleString()}</span>
                           <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-tertiary rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                             <MoreVertical className="w-5 h-5" />
                           </Button>
                         </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
