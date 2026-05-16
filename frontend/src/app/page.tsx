'use client';

import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { 
  FileText, 
  Send, 
  BarChart3, 
  Users, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Professional Invoices',
    description: 'Create beautiful, professional invoices in seconds with our intuitive editor.'
  },
  {
    icon: Send,
    title: 'One-Click Sending',
    description: 'Send invoices via email directly from the dashboard with PDF attached automatically.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track revenue, outstanding payments, and get insights into your business.'
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Organize your clients, track payment history, and build lasting relationships.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed — create an invoice in under 60 seconds, no fluff.'
  },
  {
    icon: CheckCircle2,
    title: 'Payment Tracking',
    description: 'Never miss a payment with automatic overdue reminders and status tracking.'
  }
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '5 invoices per month',
      '2 clients',
      '1 invoice template',
      'Basic PDF generation',
      'Email support'
    ]
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For growing freelancers',
    featured: true,
    features: [
      'Unlimited invoices',
      'Unlimited clients',
      'All templates',
      'Recurring invoices',
      'Advanced analytics',
      'Custom branding',
      'Priority support'
    ]
  },
  {
    name: 'Business',
    price: '$29',
    period: '/month',
    description: 'For small businesses',
    features: [
      'Everything in Pro',
      'Multi-user (up to 5)',
      'White-label PDFs',
      'API access',
      'Dedicated support'
    ]
  }
];

export default function LandingPage() {
  const handleWatchDemo = () => {
    alert('📹 Demo video coming soon!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="lg" showText={false} />
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                <span className="animate-pulse inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                Launch Sale — 20% off all plans!
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Invoices made <span className="text-primary">simple</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Create professional invoices, send them in seconds, and get paid faster. 
                Built for freelancers and small businesses who value their time.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login">
                  <Button size="lg" className="text-lg px-8">
                    Start Free — No Credit Card
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8" onClick={handleWatchDemo}>
                  Watch Demo
                </Button>
              </div>
              
              <div className="pt-8 text-sm text-muted-foreground">
                Trusted by 10,000+ businesses worldwide
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need to get paid
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From invoice creation to payment tracking, we've got you covered.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-muted-foreground text-lg">
                Choose the plan that fits your business. Upgrade or downgrade anytime.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, idx) => (
                <div 
                  key={idx} 
                  className={`p-8 rounded-2xl border flex flex-col ${
                    plan.featured 
                      ? 'border-primary bg-primary/5 relative' 
                      : 'bg-card'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/login">
                    <Button 
                      variant={plan.featured ? 'default' : 'outline'} 
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to get paid faster?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers and small businesses who trust Invoizmo.
            </p>
            <Link href="/login">
              <Button 
                variant="secondary" 
                size="lg" 
                className="text-lg px-8"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size="lg" showText={false} />
              <p className="text-muted-foreground mt-4 text-sm">
                Professional invoice generator for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Templates</Link></li>
                <li><Link href="#" className="hover:text-foreground">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 Invoizmo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
