
'use client';
import * as React from 'react';
import { Plus, ListFilter, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PermitCard } from '@/components/dashboard/permit-card';
import { PermitForm } from '@/components/permit-form';
import { PermitDetailsDialog } from '@/components/permit-details-dialog';
import type { Permit } from '@/lib/types';
import { getPermits, getPermitById } from '@/lib/actions';
import { useUser } from '@/context/user-context';
import { useRefresh } from '@/context/refresh-context';
import { Skeleton } from '@/components/ui/skeleton';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PermitsPage() {
  const { user } = useUser();
  const { refreshKey } = useRefresh();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [permits, setPermits] = React.useState<Permit[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [riskFilter, setRiskFilter] = React.useState('all');
  const [selectedPermit, setSelectedPermit] = React.useState<Permit | null>(null);

  React.useEffect(() => {
    const fetchAndSetPermits = async () => {
        setIsLoading(true);
        const fetchedPermits = await getPermits();
        setPermits(fetchedPermits.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()));
        setIsLoading(false);
    };
    fetchAndSetPermits();
  }, [refreshKey]);

  const handleOpenDetails = async (permitId: string) => {
    const permitDetails = await getPermitById(permitId);
    setSelectedPermit(permitDetails);
  };

  const handleCloseDetails = () => {
    setSelectedPermit(null);
  };

  const visiblePermits = React.useMemo(() => {
    if (!user || user.type !== 'employee') return [];
    
    const canViewAll = user.department === 'Safety' || user.department === 'Fire and Safety' || user.department === 'Security';
    
    let userPermits = canViewAll ? permits : permits.filter(p => p.issuedBy === user.name);

    if (riskFilter !== 'all') {
      userPermits = userPermits.filter(p => p.riskLevel === riskFilter);
    }
    
    return userPermits;
  }, [user, permits, riskFilter]);

  return (
    <>
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">All Permits</h1>
          <div className="flex gap-2">
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <ListFilter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by risk..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2" />
              New Permit
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        ) : visiblePermits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visiblePermits.map((permit) => (
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
                onCardClick={() => handleOpenDetails(permit.id)}
              />
            ))}
          </div>
        ) : (
           <div className="text-center py-16">
            <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Permits Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No permits match your current filters.
            </p>
          </div>
        )}
      </div>
      <PermitForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
       <PermitDetailsDialog 
        isOpen={!!selectedPermit}
        onOpenChange={(open) => !open && handleCloseDetails()}
        permit={selectedPermit}
        notificationId="" // This page doesn't originate from a notification
      />
    </>
  );
}
