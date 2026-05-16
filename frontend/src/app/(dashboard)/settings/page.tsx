'use client';

import * as React from 'react';
import { 
  Building2, 
  User, 
  Bell, 
  CreditCard, 
  Globe, 
  Lock, 
  Palette,
  Upload,
  Check,
  Save,
  Mail,
  Smartphone,
  Clock,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ColorThemeSelector } from '@/components/theme/ColorThemeSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { mockProfile } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('business');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const [formData, setFormData] = React.useState<any>(mockProfile);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully', {
        description: 'Your business profile has been updated.',
      });
    }, 1000);
  };

  const tabs = [
    { id: 'business', label: 'Business Profile', icon: Building2, desc: 'Company details & branding' },
    { id: 'account', label: 'Security', icon: ShieldCheck, desc: 'Password & access control' },
    { id: 'appearance', label: 'Interface', icon: Palette, desc: 'Themes & accent colors' },
    { id: 'notifications', label: 'Alerts', icon: Bell, desc: 'Email & push notifications' },
    { id: 'billing', label: 'Billing', icon: CreditCard, desc: 'Subscription & usage' },
  ];

  const colors = ['#0f1117', '#C8E600', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#10B981'];

  return (
    <div className="space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">System Configuration</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">Manage your global application settings and business preferences.</p>
        </div>
        <div className="flex items-center gap-3 bg-tertiary/50 p-1.5 rounded-2xl border border-border/50">
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-border/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-widest text-primary">System Online</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Settings Navigation */}
        <div className="w-full lg:w-80 space-y-2 sticky top-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-4 w-full px-6 py-4 rounded-[1.5rem] text-left transition-all duration-300 group",
                activeTab === tab.id 
                  ? "bg-accent text-accent-foreground shadow-2xl shadow-accent/20 scale-[1.02]" 
                  : "text-neutral hover:bg-tertiary hover:text-foreground border border-transparent hover:border-border/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                activeTab === tab.id ? "bg-white/20" : "bg-tertiary group-hover:bg-white shadow-sm"
              )}>
                <tab.icon className={cn("w-6 h-6", activeTab === tab.id ? "text-accent-foreground" : "text-neutral/60")} />
              </div>
              <div className="flex-1">
                <p className={cn("font-black text-sm uppercase tracking-widest", activeTab === tab.id ? "text-accent-foreground" : "text-primary")}>{tab.label}</p>
                <p className={cn("text-[10px] font-bold mt-0.5 opacity-60", activeTab === tab.id ? "text-accent-foreground" : "text-neutral")}>{tab.desc}</p>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === tab.id ? "rotate-90 opacity-100 text-accent-foreground" : "opacity-0 group-hover:opacity-40")} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeTab === 'business' && (
                <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2">
                  <CardHeader className="py-10 px-10 border-b border-border/50 bg-tertiary/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight">Business Profile</CardTitle>
                        <CardDescription className="text-neutral font-bold text-base mt-0.5">Global branding for your invoices.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-12">
                    {/* Logo Upload */}
                    <div className="flex flex-col sm:flex-row items-center gap-10 p-8 rounded-[2rem] bg-tertiary/10 border-2 border-dashed border-border/50 group hover:bg-tertiary/20 transition-all">
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 rounded-[2rem] bg-white border-2 border-border/50 flex flex-col items-center justify-center text-neutral cursor-pointer hover:border-primary hover:shadow-2xl transition-all group overflow-hidden relative shadow-xl"
                      >
                        {formData.logoUrl ? (
                          <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-primary">New Logo</span>
                          </>
                        )}
                      </div>
                      <div className="text-center sm:text-left flex-1">
                        <h4 className="text-xl font-black text-primary">Identity Logo</h4>
                        <p className="text-sm text-neutral mt-2 font-medium max-w-xs leading-relaxed">
                          Your logo will be displayed on all generated invoices and emails sent to clients.
                        </p>
                        <div className="flex gap-3 mt-6 justify-center sm:justify-start">
                          <Button 
                            variant="outline" 
                            className="h-11 px-6 font-black rounded-xl border-border/50 hover:bg-white"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Update Image
                          </Button>
                          {formData.logoUrl && (
                            <Button 
                              variant="ghost" 
                              className="h-11 px-4 font-black text-rose-500 hover:bg-rose-500/10 rounded-xl"
                              onClick={() => setFormData({ ...formData, logoUrl: '' })}
                            >
                              Reset
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/80 ml-2">Legal Entity Name</Label>
                        <Input 
                          value={formData.businessName} 
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="h-16 bg-background border-border/80 focus:ring-primary focus:border-primary font-black rounded-2xl px-6 text-xl shadow-sm transition-all" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/80 ml-2">Tax Identification</Label>
                        <Input 
                          value={formData.taxId} 
                          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                          className="h-16 bg-background border-border/80 focus:ring-primary focus:border-primary rounded-2xl px-6 font-black text-lg shadow-sm" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/80 ml-2">Support Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
                          <Input 
                            value={formData.businessEmail} 
                            onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                            className="h-16 bg-background border-border/80 focus:ring-primary focus:border-primary rounded-2xl pl-14 pr-6 font-black shadow-sm" 
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/80 ml-2">Corporate Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
                          <Input 
                            value={formData.businessWebsite} 
                            onChange={(e) => setFormData({ ...formData, businessWebsite: e.target.value })}
                            className="h-16 bg-background border-border/80 focus:ring-primary focus:border-primary rounded-2xl pl-14 pr-6 font-black shadow-sm" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/80 ml-2">Registered Address</Label>
                      <textarea 
                        className="w-full min-h-[140px] p-6 rounded-[1.5rem] border-2 border-border/80 bg-background focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-lg font-bold shadow-sm transition-all"
                        placeholder="Complete business address for legal compliance..."
                        value={formData.businessAddress.line1}
                        onChange={(e) => setFormData({ ...formData, businessAddress: { ...formData.businessAddress, line1: e.target.value } })}
                      />
                    </div>

                    <div className="pt-8 border-t border-border/50 flex justify-end">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-16 px-12 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isSaving ? <Loader2 className="w-6 h-6 mr-3 animate-spin" /> : <Save className="w-6 h-6 mr-3" />}
                        Commit Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'appearance' && (
                <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2">
                  <CardHeader className="py-10 px-10 border-b border-border/50 bg-tertiary/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Palette className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight">Interface & Branding</CardTitle>
                        <CardDescription className="text-neutral font-bold text-base mt-0.5">Customize your workspace aesthetics.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-12">
                    <div className="space-y-6">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/80 ml-2">Display Mode</Label>
                      <ThemeToggle />
                    </div>

                    <div className="space-y-6">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/80 ml-2">Color Palette</Label>
                      <ColorThemeSelector />
                    </div>

                    <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 flex items-start gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-primary/10 flex items-center justify-center text-primary shadow-sm">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-primary italic">Performance First</h4>
                        <p className="text-sm text-neutral font-medium mt-1 leading-relaxed">
                          Your interface is optimized for speed. Changes to the color palette are applied instantly across all administrative panels.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2">
                  <CardHeader className="py-10 px-10 border-b border-border/50 bg-tertiary/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Bell className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight">Alert Center</CardTitle>
                        <CardDescription className="text-neutral font-bold text-base mt-0.5">Control your business communication flow.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-6">
                     {[
                       { id: 'paymentReceived', title: 'Transaction Successful', desc: 'Real-time alert when a payment is processed.', icon: DollarSign },
                       { id: 'invoiceOverdue', title: 'Delinquency Alerts', desc: 'Critical notification for overdue account balances.', icon: Clock },
                       { id: 'newClientActivity', title: 'Engagement Tracking', desc: 'Know the moment a client views your proposal.', icon: Smartphone },
                       { id: 'weeklyReports', title: 'Executive Summary', desc: 'A consolidated weekly briefing of operations.', icon: Globe },
                     ].map((item, idx) => (
                       <div 
                        key={idx} 
                        className={cn(
                          "flex items-center justify-between p-8 rounded-[2rem] border-2 transition-all duration-500 group cursor-pointer",
                          formData.notifications[item.id] ? "bg-white border-primary/20 shadow-xl" : "bg-tertiary/10 border-transparent hover:bg-tertiary/30"
                        )}
                        onClick={() => setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            [item.id]: !formData.notifications[item.id]
                          }
                        })}
                       >
                         <div className="flex items-center gap-6">
                           <div className={cn(
                             "w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500",
                             formData.notifications[item.id] ? "bg-primary text-white rotate-[8deg] scale-110 shadow-xl" : "bg-white border border-border/50 text-neutral/40"
                           )}>
                             <item.icon className="w-8 h-8" />
                           </div>
                           <div>
                             <p className={cn("text-xl font-black uppercase tracking-tight transition-colors", formData.notifications[item.id] ? "text-primary" : "text-neutral")}>{item.title}</p>
                             <p className="text-sm text-neutral font-bold mt-1 opacity-70">{item.desc}</p>
                           </div>
                         </div>
                         <div className={cn(
                           "w-16 h-9 rounded-full relative transition-all duration-500 p-1.5",
                           formData.notifications[item.id] ? "bg-primary" : "bg-neutral/30"
                         )}>
                           <div className={cn(
                             "w-6 h-6 rounded-full bg-white shadow-xl transition-all duration-500 transform",
                             formData.notifications[item.id] ? "translate-x-7 scale-110" : "translate-x-0"
                           )}></div>
                         </div>
                       </div>
                     ))}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'account' && (
                <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2">
                  <CardHeader className="py-10 px-10 border-b border-border/50 bg-tertiary/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight">Security & Privacy</CardTitle>
                        <CardDescription className="text-neutral font-bold text-base mt-0.5">Protect your administrative access.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/80 ml-2">Admin Email</Label>
                        <Input 
                          defaultValue="habib@invoizmo.com"
                          disabled
                          className="h-16 bg-tertiary/50 border-border/80 font-black rounded-2xl px-6 text-lg cursor-not-allowed opacity-70" 
                        />
                        <p className="text-[10px] text-neutral font-bold ml-2">Contact support to change primary email.</p>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral/80 ml-2">Two-Factor Auth</Label>
                        <div className="h-16 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl flex items-center px-6 justify-between group cursor-pointer hover:bg-emerald-500/20 transition-all">
                           <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-sm">
                             <ShieldCheck className="w-5 h-5" />
                             Enabled
                           </div>
                           <Button variant="ghost" className="text-[10px] font-black uppercase text-emerald-600 hover:bg-transparent">Disable</Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-lg font-black text-primary uppercase tracking-tight ml-2">Active Sessions</h4>
                      <div className="space-y-4">
                        {[
                          { device: 'MacBook Pro 16"', location: 'London, UK', active: 'Current Session', icon: Smartphone },
                          { device: 'iPhone 15 Pro', location: 'London, UK', active: 'Active 2h ago', icon: Smartphone },
                        ].map((session, idx) => (
                          <div key={idx} className="p-6 rounded-2xl border-2 border-border/50 flex items-center justify-between hover:bg-tertiary/20 transition-all">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-xl bg-white border border-border/50 flex items-center justify-center">
                                <session.icon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-black text-primary">{session.device}</p>
                                <p className="text-xs text-neutral font-bold">{session.location} • {session.active}</p>
                              </div>
                            </div>
                            <Button variant="ghost" className="text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10">Revoke</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

