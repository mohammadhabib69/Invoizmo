'use client';

import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ColorThemeSelector } from '@/components/theme/ColorThemeSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Palette, Sparkles, Monitor, Layout, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppearancePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-24"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral/60">Interface Customization</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-primary italic">Visual Appearance</h1>
        <p className="text-muted-foreground mt-2 text-lg font-medium max-w-2xl">
          Personalize your Invoizmo workspace with high-contrast themes and professional color palettes designed for maximum productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Theme Mode Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 ml-2">
              <div className="w-10 h-10 rounded-xl bg-tertiary flex items-center justify-center border border-border/50">
                <Monitor className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Theme Preference</h2>
                <p className="text-xs text-neutral font-bold">Select your preferred system-wide display mode.</p>
              </div>
            </div>
            
            <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2">
              <CardContent className="p-8">
                <ThemeToggle />
                <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <p className="text-sm text-neutral font-medium leading-relaxed">
                    Our <span className="font-black text-primary">Onyx Dark</span> mode is engineered to reduce eye strain during late-night sessions while maintaining crystal-clear contrast.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Color Palette Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 ml-2">
              <div className="w-10 h-10 rounded-xl bg-tertiary flex items-center justify-center border border-border/50">
                <Layout className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Brand Identity</h2>
                <p className="text-xs text-neutral font-bold">Choose an accent color that represents your business.</p>
              </div>
            </div>
            
            <ColorThemeSelector />
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Preview Card */}
          <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden border-2 bg-[#0f1117] text-white sticky top-8">
            <CardHeader className="border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#C8E600]" />
                <CardTitle className="text-lg font-black uppercase tracking-widest text-white">Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="h-12 w-full rounded-xl bg-white/5 border border-white/10 animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-24 flex-1 rounded-2xl bg-[#C8E600] p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-full bg-black/10" />
                    <div className="h-3 w-12 bg-black/20 rounded-full" />
                  </div>
                  <div className="h-24 flex-1 rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <div className="h-3 w-12 bg-white/20 rounded-full" />
                  </div>
                </div>
                <div className="h-32 w-full rounded-[1.5rem] bg-white/5 border border-white/10 p-6 space-y-3">
                  <div className="h-3 w-3/4 bg-white/10 rounded-full" />
                  <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                  <div className="h-8 w-24 bg-[#C8E600] rounded-xl mt-4" />
                </div>
              </div>
              <p className="text-[10px] text-center font-bold text-neutral uppercase tracking-widest opacity-40">
                Preview reflects Onyx Dark interface
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
