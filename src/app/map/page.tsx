'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PermitCard } from '@/components/permit-card';
import { PermitForm } from '@/components/permit-form';
import { QRDialog } from '@/components/qr-dialog';
import { Skeleton } from '@/components/ui/skeleton';

import type { Permit } from '@/lib/types';
import { initialPermits } from '@/lib/data';

const MapView = dynamic(
  () => import('@/components/map-view').then(mod => mod.MapView),
  {
    loading: () => <Skeleton className="h-full w-full" />,
    ssr: false,
  }
);

export default function MapPage() {
  const [permits, setPermits] = React.useState<Permit[]>(initialPermits);
  const [selectedPermit, setSelectedPermit] = React.useState<Permit | null>(
    initialPermits[0] || null
  );
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [qrPermit, setQrPermit] = React.useState<Permit | null>(null);

  const handlePermitCreated = React.useCallback((newPermit: Permit) => {
    setPermits(prev => [newPermit, ...prev]);
    setSelectedPermit(newPermit);
    setIsFormOpen(false);
  }, []);

  const handleSelectPermit = React.useCallback((permit: Permit) => {
    setSelectedPermit(permit);
  }, []);

  const handleViewQr = React.useCallback((permit: Permit) => {
    setQrPermit(permit);
  }, []);

  const handleMarkerClick = React.useCallback((permit: Permit | null) => {
    setSelectedPermit(permit);
  }, []);

  return (
    <>
      <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-6.5rem)] grid md:grid-cols-[380px_1fr] lg:grid-cols-[420px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col border-r bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Active Permits</h2>
            <Button size="sm" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2 p-4">
              {permits.map(permit => (
                <PermitCard
                  key={permit.id}
                  permit={permit}
                  isSelected={selectedPermit?.id === permit.id}
                  onSelect={handleSelectPermit}
                  onViewQr={handleViewQr}
                />
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Map View */}
        <main className="h-full w-full">
          <MapView
            permits={permits}
            selectedPermit={selectedPermit}
            onMarkerClick={handleMarkerClick}
          />
        </main>
      </div>

      <PermitForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onPermitCreated={handlePermitCreated}
      />
      <QRDialog permit={qrPermit} onOpenChange={() => setQrPermit(null)} />
    </>
  );
}
