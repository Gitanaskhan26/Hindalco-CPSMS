
'use client';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Notification, Permit, VisitorRequest } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import { PermitDetailsDialog } from './permit-details-dialog';
import { VisitorRequestDetailsDialog } from './visitor-request-details-dialog';
import { AlertTriangle, CheckCircle, FileText, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { getPermitById, getVisitorRequestById } from '@/lib/actions';

interface NotificationItemProps {
  notification: Notification;
}

const typeIconMap = {
  permit_approval: <AlertTriangle className="h-5 w-5 text-orange-500" />,
  permit_status_update: <CheckCircle className="h-5 w-5 text-green-600" />,
  visitor_request: <UserPlus className="h-5 w-5 text-blue-500" />,
}

const typeIconMapWithDecision = {
    ...typeIconMap,
    visitor_request_approved: <CheckCircle2 className="h-5 w-5 text-green-600" />,
};


export function NotificationItem({ notification }: NotificationItemProps) {
  const { toast } = useToast();
  const [isPermitDetailsOpen, setIsPermitDetailsOpen] = React.useState(false);
  const [isVisitorDetailsOpen, setIsVisitorDetailsOpen] = React.useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = React.useState(false);
  const [permitDetails, setPermitDetails] = React.useState<Permit | null>(null);
  const [visitorRequestDetails, setVisitorRequestDetails] = React.useState<VisitorRequest | null>(null);


  const handleViewDetails = async () => {
    const { visitorRequestId, permitId } = notification.payload;

    setIsFetchingDetails(true);

    try {
      if (visitorRequestId) {
        const request = await getVisitorRequestById(visitorRequestId);
        if (request) {
          setVisitorRequestDetails(request);
          setIsVisitorDetailsOpen(true);
        } else {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not find the visitor request.' });
        }
      } else if (permitId) {
        const permit = await getPermitById(permitId);
        if (permit) {
          setPermitDetails(permit);
          setIsPermitDetailsOpen(true);
        } else {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not find the permit details.' });
        }
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch details.' });
    } finally {
      setIsFetchingDetails(false);
    }
  };


  return (
    <>
      <div className={cn(
        "flex items-start gap-4 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors",
        !notification.isRead && "bg-blue-500/5"
      )}>
        <Avatar className="h-8 w-8 mt-1 border">
            <AvatarFallback className="bg-transparent text-primary">
                {notification.title.includes("Approved")
                    ? typeIconMapWithDecision['visitor_request_approved']
                    : typeIconMap[notification.type]}
            </AvatarFallback>
        </Avatar>
        <div className="grid gap-1 flex-1">
          <p className="font-semibold text-sm">{notification.title}</p>
          <p className="text-sm text-muted-foreground">{notification.description}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground/80">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </p>
            <Button variant="link" size="sm" className="h-auto p-0" onClick={handleViewDetails} disabled={isFetchingDetails}>
                {isFetchingDetails ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'View details'}
            </Button>
          </div>
        </div>
      </div>
      <PermitDetailsDialog
        isOpen={isPermitDetailsOpen}
        onOpenChange={setIsPermitDetailsOpen}
        permit={permitDetails}
        notificationId={notification.id}
      />
      <VisitorRequestDetailsDialog
        isOpen={isVisitorDetailsOpen}
        onOpenChange={setIsVisitorDetailsOpen}
        request={visitorRequestDetails}
        notificationId={notification.id}
      />
    </>
  );
}
