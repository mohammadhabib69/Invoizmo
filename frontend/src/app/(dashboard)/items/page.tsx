'use client';

import * as React from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  Package,
  Tags,
  DollarSign,
  Layers,
  ArrowUpRight,
  Boxes
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { items } from '@/lib/mockData';

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const listItem = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Services & Items</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your catalog for faster invoicing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border font-bold hover:bg-tertiary h-12 px-6 rounded-xl">
             <Boxes className="w-4 h-4 mr-2" />
             Categories
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-xl shadow-primary/20">
            <Plus className="w-5 h-5 mr-2" />
            Add New Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left: Items Table */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-border shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products or services..." 
                  className="pl-11 h-12 bg-tertiary/30 border-transparent focus:bg-white focus:border-primary rounded-xl transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-2xl shadow-primary/5 overflow-hidden rounded-3xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-tertiary/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="pl-8 h-16 font-black text-primary uppercase text-[11px] tracking-widest">Item Name</TableHead>
                    <TableHead className="font-black text-primary uppercase text-[11px] tracking-widest">Unit</TableHead>
                    <TableHead className="font-black text-primary uppercase text-[11px] tracking-widest text-center">Tax %</TableHead>
                    <TableHead className="font-black text-primary uppercase text-[11px] tracking-widest">Price</TableHead>
                    <TableHead className="pr-8 font-black text-primary uppercase text-[11px] tracking-widest text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <motion.tr
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="contents"
                  >
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id} className="h-20 border-tertiary group hover:bg-tertiary/20 transition-all duration-300">
                          <TableCell className="pl-8">
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-[#C8E600] group-hover:text-[#0f1117] transition-all">
                                 <Package className="w-5 h-5" />
                               </div>
                               <span className="font-black text-primary text-base">{item.name}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <span className="text-sm font-bold text-neutral uppercase tracking-tighter">{item.unit}</span>
                          </TableCell>
                          <TableCell className="text-center">
                             <span className="px-3 py-1 bg-tertiary rounded-lg text-xs font-black text-primary">
                               {item.tax}%
                             </span>
                          </TableCell>
                          <TableCell>
                             <span className="text-lg font-black text-primary">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                              <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-tertiary rounded-xl transition-all">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 rounded-3xl bg-tertiary/50 flex items-center justify-center">
                              <Package className="w-8 h-8 text-neutral" />
                            </div>
                            <div>
                              <p className="text-xl font-black text-primary">Catalog is empty</p>
                              <p className="text-muted-foreground font-medium">Add your first item to start invoicing faster.</p>
                            </div>
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

        {/* Right: Quick Add Form */}
        <Card className="border-border shadow-2xl shadow-primary/5 sticky top-24 overflow-hidden rounded-[2.5rem] bg-[#0f1117] text-white">
          <CardHeader className="py-10 px-10 border-b border-white/5">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <Plus className="w-6 h-6 text-[#C8E600]" />
              Quick Add
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-[#847991] flex items-center gap-2">
                Item Name
              </Label>
              <Input placeholder="e.g. Graphic Design Services" className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:bg-white/10 focus:border-[#C8E600] transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-[#847991]">
                  Unit Type
                </Label>
                <Input placeholder="Hour/Flat" className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:bg-white/10 transition-all" />
              </div>
              <div className="space-y-3">
                <Label className="text-[11px] font-black uppercase tracking-widest text-[#847991]">
                  Tax %
                </Label>
                <Input type="number" defaultValue="0" className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:bg-white/10 transition-all" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-[#847991]">
                Unit Price
              </Label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#847991] font-black text-lg">$</span>
                <Input type="number" placeholder="0.00" className="h-14 pl-10 bg-white/5 border-white/10 text-white rounded-2xl focus:bg-white/10 transition-all text-lg font-black" />
              </div>
            </div>

            <Button className="w-full h-16 bg-[#C8E600] text-[#0f1117] hover:bg-[#C8E600]/90 font-black text-lg rounded-[1.5rem] shadow-xl shadow-[#C8E600]/20 mt-4 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Create Item
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
