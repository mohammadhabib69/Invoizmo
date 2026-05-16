'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/auth/AuthProvider';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await register(firstName, lastName, email, password);
      } else {
        await login(email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <Logo size="md" showText={false} linkTo={null} />
        </Link>
      </div>

      <div className="w-full max-w-[1000px] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl shadow-zinc-200/50 dark:shadow-none overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-zinc-100 dark:border-zinc-800">
        
        {/* Left Side: Content/Toggle Panel */}
        <div className={cn(
          "w-full md:w-[40%] p-8 sm:p-12 flex flex-col justify-center items-center text-center transition-all duration-700 ease-in-out order-2 md:order-none",
          isSignUp ? "bg-primary text-primary-foreground" : "bg-zinc-900 text-white"
        )}>
          <div className="max-w-xs">
            <h1 className="text-3xl sm:text-4xl font-black mb-6">
              {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
            </h1>
            <p className={cn(
              "text-sm sm:text-base mb-10 leading-relaxed font-medium opacity-80",
              isSignUp ? "text-primary-foreground/80" : "text-zinc-300"
            )}>
              {isSignUp 
                ? "Enter your personal details to use all of site features" 
                : "Register with your personal details to use all of site features"}
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSignUp(!isSignUp)}
              className={cn(
                "w-full h-12 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95",
                isSignUp 
                  ? "border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" 
                  : "border-white/20 text-white hover:bg-white/10"
              )}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-[60%] p-8 sm:p-12 flex flex-col justify-center order-1 md:order-none">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
                {isSignUp ? "Create Account" : "Sign In"}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                {isSignUp 
                  ? "Join the next generation of invoice management" 
                  : "Welcome back! Please enter your details."}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mb-8">
              {['google', 'github', 'linkedin'].map((social) => (
                <button 
                  key={social}
                  className="flex-1 h-12 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <i className={cn(
                    "fa-brands text-xl text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors",
                    `fa-${social}`
                  )}></i>
                </button>
              ))}
            </div>

            <div className="relative mb-8 text-center">
              <span className="bg-white dark:bg-zinc-900 px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest relative z-10">
                Or use email
              </span>
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-100 dark:bg-zinc-800 -z-0"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-wider text-zinc-500">First Name</Label>
                    <Input
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none ring-0 focus-visible:ring-2 focus-visible:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-wider text-zinc-500">Last Name</Label>
                    <Input
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none ring-0 focus-visible:ring-2 focus-visible:ring-primary"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-wider text-zinc-500">Email Address</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none ring-0 focus-visible:ring-2 focus-visible:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="font-bold text-xs uppercase tracking-wider text-zinc-500">Password</Label>
                  {!isSignUp && (
                    <a href="#" className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors">
                      Forgot?
                    </a>
                  )}
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none ring-0 focus-visible:ring-2 focus-visible:ring-primary"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 text-sm font-medium border border-rose-100 dark:border-rose-900/20">
                  {error}
                </div>
              )}

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              >
                {isLoading && <Spinner size="sm" className="mr-2 border-primary-foreground" />}
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Font Awesome for icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" 
      />
    </div>
  );
}
