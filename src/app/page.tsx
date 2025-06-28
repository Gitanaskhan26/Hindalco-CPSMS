'use client';

import * as React from 'react';
import {
  AlertTriangle,
  MapPin,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PermitForm } from '@/components/permit-form';
import { MapView } from '@/components/map-view';
import { QRDialog } from '@/components/qr-dialog';
import { PermitCard } from '@/components/permit-card';
import type { Permit, RiskLevel } from '@/lib/types';
import { Logo } from '@/components/icons';

const initialPermits: Permit[] = [
    {
        id: '1',
        description: 'Hot work permit for welding in Section A. Requires fire watch and extinguisher.',
        ppeChecklist: 'Welding helmet, fire-resistant gloves, safety glasses, steel-toed boots.',
        riskLevel: 'high',
        justification: 'Hot work involving open flames and sparks poses a high risk of fire and burns.',
        lat: 22.5726,
        lng: 88.3639,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({id: '1', risk: 'high'}))}`
    },
    {
        id: '2',
        description: 'Confined space entry for tank inspection. Atmosphere testing required before entry.',
        ppeChecklist: 'Full body harness, lifeline, gas detector, helmet, safety boots.',
        riskLevel: 'medium',
        justification: 'Confined space entry has potential hazards like poor air quality and entrapment.',
        lat: 22.5800,
        lng: 88.3700,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({id: '2', risk: 'medium'}))}`
    },
    {
        id: '3',
        description: 'General maintenance work in a non-hazardous area. Standard safety protocols apply.',
        ppeChecklist: 'Safety helmet, safety shoes.',
        riskLevel: 'low',
        justification: 'Routine work with no specific high-risk activities identified.',
        lat: 22.5650,
        lng: 88.3600,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({id: '3', risk: 'low'}))}`
    }
];


export default function Home() {
  const [permits, setPermits] = React.useState<Permit[]>(initialPermits);
  const [selectedPermit, setSelectedPermit] = React.useState<Permit | null>(initialPermits[0]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [qrPermit, setQrPermit] = React.useState<Permit | null>(null);

  const handleNewPermit = (permit: Permit) => {
    setPermits(prev => [permit, ...prev]);
    setSelectedPermit(permit);
    setIsFormOpen(false);
  };

  const riskCounts = React.useMemo(() => {
    return permits.reduce(
      (acc, permit) => {
        acc[permit.riskLevel]++;
        return acc;
      },
      { high: 0, medium: 0, low: 0 } as Record<RiskLevel, number>
    );
  }, [permits]);


  return (
    <div className="grid h-screen w-full lg:grid-cols-[380px_1fr]">
      <div className="flex flex-col border-r bg-card">
        <header className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center gap-3">
                <Logo className="h-8 w-8" />
                <h1 className="text-lg font-semibold text-primary">C-PSMS</h1>
            </div>
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Permit
          </Button>
        </header>

        <div className="p-4">
            <h2 className="text-xl font-bold">Active Permits</h2>
            <div className="mt-2 grid grid-cols-3 gap-4">
                <Card className="border-red-500/50 bg-red-500/10">
                    <CardHeader className="p-4">
                        <CardTitle className="text-red-600">High Risk</CardTitle>
                        <CardDescription className="text-3xl font-bold text-red-700">{riskCounts.high}</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="border-orange-500/50 bg-orange-500/10">
                    <CardHeader className="p-4">
                        <CardTitle className="text-orange-600">Medium Risk</CardTitle>
                        <CardDescription className="text-3xl font-bold text-orange-700">{riskCounts.medium}</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="border-green-500/50 bg-green-500/10">
                    <CardHeader className="p-4">
                        <CardTitle className="text-green-600">Low Risk</CardTitle>
                        <CardDescription className="text-3xl font-bold text-green-700">{riskCounts.low}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-4 pt-0">
            {permits.length > 0 ? (
              permits.map(permit => (
                <PermitCard
                  key={permit.id}
                  permit={permit}
                  isSelected={selectedPermit?.id === permit.id}
                  onSelect={() => setSelectedPermit(permit)}
                  onViewQr={() => setQrPermit(permit)}
                />
              ))
            ) : (
              <div className="flex h-40 flex-col items-center justify-center text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8" />
                <p className="mt-2">No active permits.</p>
                <p className="text-sm">Click Create Permit to get started.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <main className="relative flex flex-col">
        <MapView permits={permits} selectedPermit={selectedPermit} onMarkerClick={setSelectedPermit} />
        <div className="pointer-events-none absolute bottom-4 right-4">
            <Card className="pointer-events-auto">
                <CardContent className="p-2">
                    <Button variant="ghost" size="sm" asChild>
                        <a href="/login">Logout</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>

      <PermitForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onPermitCreated={handleNewPermit}
      />

      <QRDialog
        permit={qrPermit}
        onOpenChange={() => setQrPermit(null)}
      />
    </div>
  );
}
