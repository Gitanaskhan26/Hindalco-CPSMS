'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would perform authentication here
    router.push('/');
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden bg-gray-100 lg:flex flex-col items-center justify-center p-12 text-white bg-primary">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(https://placehold.co/1200x1200.png)'}}
          data-ai-hint="industrial safety background"
        />
        <div className="relative z-10 text-center">
            <Logo width={200} height={22} className="mx-auto mb-6" />
            <h1 className="text-4xl font-bold">
              Centralized Permit & Safety Management System
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Streamlining safety protocols with cutting-edge technology to ensure a secure and efficient work environment.
            </p>
            <div className="mt-8 space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-start gap-4">
                    <ShieldCheck className="h-8 w-8 mt-1 text-accent flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">AI-Powered Risk Assessment</h3>
                        <p className="text-sm text-primary-foreground/70">Automatically identify and mitigate potential hazards before they escalate.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <ShieldCheck className="h-8 w-8 mt-1 text-accent flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">Real-Time Geo-Tagging</h3>
                        <p className="text-sm text-primary-foreground/70">Visualize active work permits on a live plant map for enhanced situational awareness.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <ShieldCheck className="h-8 w-8 mt-1 text-accent flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">Digital & QR-Verified Permits</h3>
                        <p className="text-sm text-primary-foreground/70">Eliminate paperwork with secure, instantly verifiable digital work permits.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <Card className="w-full max-w-sm border-0 shadow-none sm:border sm:shadow-sm">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center lg:hidden">
                <Logo width={150} height={16} />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access the C-PSMS dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  defaultValue="user@hindalco.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  defaultValue="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              © Hindalco Industries Ltd. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
