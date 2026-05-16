'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Save, 
  Send,
  Calendar as CalendarIcon,
  User,
  FileText,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { useQuery, useMutation } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api/clients';
import { itemsApi } from '@/lib/api/items';
import { invoicesApi } from '@/lib/api/invoices';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LineItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  tax: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = React.useState('');
  const [lineItems, setLineItems] = React.useState<LineItem[]>([
    { id: '1', name: '', qty: 1, price: 0, tax: 0 }
  ]);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [notes, setNotes] = React.useState('');
  const [invoiceNumber, setInvoiceNumber] = React.useState('');

  // Fetch clients
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getClients,
  });

  // Fetch catalog items
  const { data: catalogItems = [] } = useQuery({
    queryKey: ['catalogItems'],
    queryFn: itemsApi.getItems,
  });

  // Fetch next invoice number
  const { data: nextNumber } = useQuery({
    queryKey: ['nextInvoiceNumber'],
    queryFn: invoicesApi.getNextInvoiceNumber,
  });

  React.useEffect(() => {
    if (nextNumber) setInvoiceNumber(nextNumber);
  }, [nextNumber]);

  const createInvoiceMutation = useMutation({
    mutationFn: (isDraft: boolean) => {
      const subtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
      const discountAmount = subtotal * (discount / 100);
      const totalTax = lineItems.reduce((acc, item) => {
        const itemSubtotal = item.qty * item.price;
        const itemDiscount = itemSubtotal * (discount / 100);
        return acc + ((itemSubtotal - itemDiscount) * (item.tax / 100));
      }, 0);

      const taxableAmount = subtotal - discountAmount;

      return invoicesApi.createInvoice({
        client: selectedClient,
        invoiceNumber,
        lineItems: lineItems.map(item => ({
          name: item.name,
          quantity: item.qty,
          unitPrice: item.price,
          total: item.qty * item.price
        })),
        invoiceDate: date,
        dueDate: dueDate || date,
        subtotal,
        discountPercentage: discount,
        discountAmount,
        taxPercentage: taxableAmount > 0 ? (totalTax / taxableAmount) * 100 : 0,
        taxAmount: totalTax,
        total: subtotal - discountAmount + totalTax,
        status: isDraft ? 'draft' : 'pending',
        notes,
      });
    },
    onSuccess: () => {
      toast.success('Invoice created successfully');
      router.push('/invoices');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create invoice');
    }
  });

  const clientOptions = clients.map(c => ({ 
    value: c._id, 
    label: `${c.name} ${c.company ? `(${c.company})` : ''}` 
  }));

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Math.random().toString(36).substr(2, 9), name: '', qty: 1, price: 0, tax: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const onSelectCatalogItem = (id: string, itemId: string) => {
    const catalogItem = catalogItems.find(i => i._id === itemId);
    if (catalogItem) {
      setLineItems(lineItems.map(item => 
        item.id === id ? { 
          ...item, 
          name: catalogItem.name, 
          price: catalogItem.price, 
          tax: catalogItem.tax 
        } : item
      ));
    }
  };

  const subtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const totalTax = lineItems.reduce((acc, item) => {
    const itemSubtotal = item.qty * item.price;
    const itemDiscount = itemSubtotal * (discount / 100);
    return acc + ((itemSubtotal - itemDiscount) * (item.tax / 100));
  }, 0);
  const total = taxableAmount + totalTax;

  const handleSave = (isDraft: boolean) => {
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }
    createInvoiceMutation.mutate(isDraft);
  };

  return (
    <div className="page-enter max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Invoice</h1>
            <p className="text-neutral-foreground/60">Draft a professional invoice for your client.</p>
          </div>
        </div>
                <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="h-11 border-zinc-200" 
            onClick={() => handleSave(true)}
            disabled={createInvoiceMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white font-black h-11 px-6 shadow-lg shadow-[#0f1117]/20" 
            onClick={() => handleSave(false)}
            disabled={createInvoiceMutation.isPending}
          >
            {createInvoiceMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Selection */}
          <Card className="border-border shadow-xl shadow-secondary/5">
            <CardHeader className="py-6 border-b border-zinc-50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Select 
                label="Select Client"
                placeholder="Choose a client..."
                options={clientOptions}
                value={selectedClient}
                onChange={setSelectedClient}
              />
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-border shadow-xl shadow-secondary/5">
            <CardHeader className="py-6 border-b border-zinc-50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Line Items
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={addLineItem} className="text-primary font-bold hover:bg-primary/10">
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {lineItems.map((item, idx) => (
                  <div key={item.id} className="p-6 space-y-4 group relative">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-12 space-y-2">
                        <Label className="text-[10px] font-black uppercase text-neutral">Quick Add from Catalog</Label>
                                                <Select 
                          placeholder="Select an item from catalog..."
                          options={catalogItems.map(i => ({ value: i._id, label: `${i.name} - $${i.price}` }))}
                          value=""
                          onChange={(val) => onSelectCatalogItem(item.id, val)}
                          className="h-10"
                        />
                      </div>
                      <div className="md:col-span-6 space-y-2">
                        <Label className="text-[10px] font-black uppercase text-neutral">Description</Label>
                        <Input 
                          placeholder="What are you charging for?" 
                          value={item.name}
                          onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                          className="h-11 border-zinc-200 focus:ring-primary"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase text-neutral">Qty</Label>
                        <Input 
                          type="number" 
                          value={item.qty}
                          onChange={(e) => updateLineItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                          className="h-11 border-zinc-200 focus:ring-primary"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase text-neutral">Price</Label>
                        <Input 
                          type="number" 
                          value={item.price}
                          onChange={(e) => updateLineItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="h-11 border-zinc-200 focus:ring-primary"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase text-neutral">Tax %</Label>
                        <Input 
                          type="number" 
                          value={item.tax}
                          onChange={(e) => updateLineItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                          className="h-11 border-zinc-200 focus:ring-primary"
                        />
                      </div>
                    </div>
                    {lineItems.length > 1 && (
                      <button 
                        onClick={() => removeLineItem(item.id)}
                        className="absolute top-4 right-4 text-zinc-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Summary & Options */}
        <div className="space-y-6">
          <Card className="border-border shadow-xl shadow-secondary/5 sticky top-24">
            <CardHeader className="py-6 border-b border-zinc-50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Subtotal</span>
                  <span className="text-zinc-900 font-bold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Discount ({discount}%)</span>
                  <span className="text-rose-500 font-bold">-${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Estimated Tax</span>
                  <span className="text-zinc-900 font-bold">${totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                  <span className="text-lg font-black text-zinc-900">Total</span>
                  <span className="text-2xl font-black text-zinc-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-neutral">Discount (%)</Label>
                  <Input 
                    type="number" 
                    value={discount} 
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="h-11 border-zinc-200 focus:ring-primary" 
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-neutral">Invoice Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral" />
                    <Input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)}
                      className="h-11 pl-10 border-zinc-200 focus:ring-primary" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-neutral">Due Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral" />
                    <Input 
                      type="date" 
                      value={dueDate} 
                      onChange={(e) => setDueDate(e.target.value)}
                      className="h-11 pl-10 border-zinc-200 focus:ring-primary" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-[10px] font-black uppercase text-neutral">Notes (Internal)</Label>
                                <textarea 
                  className="w-full min-h-[80px] p-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                  placeholder="Private notes for your records..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
