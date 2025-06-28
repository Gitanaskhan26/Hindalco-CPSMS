'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ScanLine, Map, ShieldCheck } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { PermitCard } from '@/components/dashboard/permit-card';
import { PermitForm } from '@/components/permit-form';
import type { Permit } from '@/lib/types';
import { initialPermits } from '@/lib/data';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [permits, setPermits] = React.useState<Permit[]>(initialPermits);

  const stats = React.useMemo(() => {
    const activePermits = permits.filter(
      p => p.status === 'Approved' || p.status === 'Pending'
    ).length;
    const pendingApproval = permits.filter(p => p.status === 'Pending').length;
    const highRiskToday = permits.filter(p => p.riskLevel === 'high').length;

    return [
      {
        title: 'Active Permits',
        value: activePermits.toString(),
        change: '+12%',
      },
      {
        title: 'Pending Approval',
        value: pendingApproval.toString(),
        change: '-3%',
      },
      {
        title: 'High Risk Today',
        value: highRiskToday.toString(),
        change: '+1%',
      },
      { title: 'Compliance Rate', value: '92%', change: '+4%' }, // Mocked
    ];
  }, [permits]);

  const handlePermitCreated = (newPermit: Permit) => {
    setPermits(prev => [newPermit, ...prev]);
    setIsFormOpen(false);
  };

  const recentPermits = permits.slice(0, 4);

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2" />
            New Permit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
            />
          ))}
        </div>

        <div className="bg-card rounded-xl shadow-sm p-4 md:p-6 mb-8 border">
          <h2 className="text-xl font-bold mb-4">Recent Permits</h2>
          <div className="space-y-4">
            {recentPermits.map(permit => (
              <PermitCard
                key={permit.id}
                id={permit.id}
                type="Work Permit"
                location="Plant Area"
                risk={
                  permit.riskLevel.charAt(0).toUpperCase() +
                  permit.riskLevel.slice(1) as any
                }
                status={permit.status}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-24 text-base flex-col sm:flex-row"
            asChild
          >
            <Link href="/scan">
              <ScanLine className="mb-2 sm:mb-0 sm:mr-2" />
              Scan QR Code
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-24 text-base flex-col sm:flex-row"
            asChild
          >
            <Link href="/map">
              <Map className="mb-2 sm:mb-0 sm:mr-2" />
              View Plant Map
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-24 text-base flex-col sm:flex-row"
            asChild
          >
            <Link href="/permits">
              <ShieldCheck className="mb-2 sm:mb-0 sm:mr-2" />
              All Permits
            </Link>
          </Button>
        </div>
      </div>
      <PermitForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onPermitCreated={handlePermitCreated}
      />
    </>
  );
}
