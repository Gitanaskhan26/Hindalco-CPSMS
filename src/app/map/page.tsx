
'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PermitCard } from '@/components/permit-card';
import { PermitForm } from '@/components/permit-form';
import { QRDialog } from '@/components/qr-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useRefresh } from '@/context/refresh-context';

import type { Permit, Visitor } from '@/lib/types';
import { getPermits, getActiveVisitors } from '@/lib/actions';

// Dynamically import the MapView component to prevent SSR issues with Leaflet.
const MapView = dynamic(() => import('@/components/map-view'), {
  loading: () => <Skeleton className="h-full w-full" />,
  ssr: false,
});

export default function MapPage() {
  const { refreshKey } = useRefresh();
  const [permits, setPermits] = React.useState<Permit[]>([]);
  const [visitors, setVisitors] = React.useState<Visitor[]>([]);
  const [selectedPermit, setSelectedPermit] = React.useState<Permit | null>(null);
  const [selectedVisitor, setSelectedVisitor] = React.useState<Visitor | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [qrPermit, setQrPermit] = React.useState<Permit | null>(null);
  const searchParams = useSearchParams();

  // Data load effect
  React.useEffect(() => {
    const loadData = async () => {
        const [fetchedPermits, fetchedVisitors] = await Promise.all([
        getPermits(),
        getActiveVisitors(),
        ]);
        setPermits(fetchedPermits);
        setVisitors(fetchedVisitors);
    };
    loadData();
  }, [refreshKey]);
  

  // Effect to handle selecting a permit or visitor from the URL.
  React.useEffect(() => {
    const permitId = searchParams.get('permitId');
    const visitorId = searchParams.get('visitorId');

    // Use a timeout to ensure map and markers are likely rendered
    setTimeout(() => {
      if (visitorId && visitors.length > 0) {
          const visitorFromUrl = visitors.find(v => v.id === visitorId);
          if (visitorFromUrl) {
              setSelectedVisitor(visitorFromUrl);
              setSelectedPermit(null);
          }
      } else if (permitId && permits.length > 0) {
        const permitFromUrl = permits.find(p => p.id === permitId);
        if (permitFromUrl) {
          setSelectedPermit(permitFromUrl);
          setSelectedVisitor(null);
        }
      }
    }, 100);
  }, [searchParams, permits, visitors]);

  const handleSelectPermit = React.useCallback((permit: Permit) => {
    setSelectedPermit(permit);
    setSelectedVisitor(null);
  }, []);

  const handleViewQr = React.useCallback((permit: Permit) => {
    setQrPermit(permit);
  }, []);

  const handleMarkerClick = React.useCallback((permit: Permit | null) => {
    setSelectedPermit(permit);
    setSelectedVisitor(null);
  }, []);

  const handleVisitorMarkerClick = React.useCallback((visitor: Visitor | null) => {
    setSelectedVisitor(visitor);
    setSelectedPermit(null);
  }, []);

  const handleCloseQrDialog = React.useCallback(() => {
    setQrPermit(null);
  }, []);

  return (
    <>
      <div className="flex-1 w-full relative">
        {/* Map View takes up the full space by being positioned absolutely within its relative parent */}
        <div className="absolute inset-0">
          <MapView
            permits={permits}
            selectedPermit={selectedPermit}
            onMarkerClick={handleMarkerClick}
            visitors={visitors}
            selectedVisitor={selectedVisitor}
            onVisitorMarkerClick={handleVisitorMarkerClick}
          />
        </div>
        
        {/* Sidebar floats over the map on desktop */}
        <aside className="absolute top-0 left-0 h-full z-10 hidden md:flex flex-col bg-card/90 backdrop-blur-sm border-r w-[380px] lg:w-[420px] flex-shrink-0 shadow-lg">
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

        {/* Floating Action Button for mobile */}
        <div className="md:hidden absolute bottom-20 right-4 z-10">
            <Button size="lg" className="rounded-full w-16 h-16 shadow-lg" onClick={() => setIsFormOpen(true)}>
                <Plus className="h-8 w-8" />
                <span className="sr-only">New Permit</span>
            </Button>
        </div>
      </div>

      <PermitForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
      <QRDialog permit={qrPermit} onOpenChange={handleCloseQrDialog} />
    </>
  );
}
