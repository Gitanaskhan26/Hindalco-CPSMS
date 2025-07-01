
'use client';

import * as React from 'react';
import type { Permit } from '@/lib/types';
import { useUser } from '@/context/user-context';
import { useNotification } from '@/context/notification-context';
import { useRefresh } from '@/context/refresh-context';
import { useToast } from '@/hooks/use-toast';
import { handlePermitDecision } from '@/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Shield, User, Calendar, Clock, FileText, XCircle, CheckCircle, AlertTriangle, UserCheck, Check, Ban, History, FileDown, Loader2 } from 'lucide-react';
import HindalcoLogoAsset from '@/components/Assets/HINDALCO-logo.ico';

interface PermitDetailsDialogProps {
  permit: Permit | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  notificationId: string;
}

const riskColorMap = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-orange-400/10 text-orange-500 border-orange-400/20',
  low: 'bg-green-500/10 text-green-600 border-green-500/20',
};

const statusIconMap: Record<Permit['status'], React.ReactElement> = {
    Approved: <CheckCircle className="h-4 w-4 text-green-600" />,
    Pending: <AlertTriangle className="h-4 w-4 text-orange-500" />,
    Rejected: <XCircle className="h-4 w-4 text-destructive" />,
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-4 py-3 border-b last:border-b-0">
        <div className="flex-shrink-0 text-muted-foreground pt-1">{icon}</div>
        <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground break-words">{value}</p>
        </div>
    </div>
);

export function PermitDetailsDialog({ permit, isOpen, onOpenChange, notificationId }: PermitDetailsDialogProps) {
  const { user } = useUser();
  const { reloadNotifications } = useNotification();
  const { triggerRefresh } = useRefresh();
  const { toast } = useToast();
  const printableRef = React.useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isActionPending, setIsActionPending] = React.useState(false);
  
  const handleDecision = async (decision: 'Approved' | 'Rejected') => {
    if (!permit || !user || !notificationId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Missing required information.' });
        return;
    }

    setIsActionPending(true);
    try {
        const result = await handlePermitDecision(permit.id, decision, user.id, user.name, notificationId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            reloadNotifications();
            triggerRefresh();
            onOpenChange(false);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    } finally {
        setIsActionPending(false);
    }
  };

  const handleExport = async () => {
    if (!printableRef.current || !permit) return;
    setIsExporting(true);

    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(printableRef.current, {
        scale: 2,
        useCORS: true, 
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Permit-${permit.id}.pdf`);

    } catch (error) {
      console.error("Failed to export PDF", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!permit) return null;

  const canActionPermit = user?.type === 'employee' && 
                          (user.department === 'Safety' || user.department === 'Fire and Safety') &&
                          permit.status === 'Pending';

  return (
    <>
      {/* Hidden printable component */}
      {isOpen && (
        <div
          ref={printableRef}
          className="absolute -left-[9999px] top-0 w-[595pt] bg-white text-black p-[40pt]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {/* Header */}
          <header className="flex justify-between items-center border-b-2 border-gray-800 pb-4">
            <div className="flex items-center gap-4">
              <img src={HindalcoLogoAsset.src} alt="Hindalco Logo" width="60" height="60" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Work Permit</h1>
                <p className="text-gray-600">Hindalco Industries Ltd.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Permit ID</p>
              <p className="font-mono text-lg font-semibold">{permit.id}</p>
            </div>
          </header>

          <main className="mt-8">
            {/* Summary Box */}
            <div className="grid grid-cols-3 gap-px rounded-lg border border-gray-300 bg-gray-300 overflow-hidden">
              <div className="bg-white p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                <p className="font-bold text-lg">{permit.status}</p>
              </div>
              <div className="bg-white p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Risk Level</p>
                <p className="font-bold text-lg capitalize">{permit.riskLevel}</p>
              </div>
              <div className="bg-white p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Issued By</p>
                <p className="font-bold text-lg">{permit.issuedBy}</p>
              </div>
            </div>

            {/* Details Section */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4">Permit Details</h2>
              <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
                <strong className="font-medium text-gray-700">Work Description:</strong>
                <p>{permit.description}</p>
                <strong className="font-medium text-gray-700">Required PPE:</strong>
                <p>{permit.ppeChecklist}</p>
                <strong className="font-medium text-gray-700">Issue Date:</strong>
                <p>{format(new Date(permit.issueDate), 'dd MMM yyyy, h:mm a')}</p>
                <strong className="font-medium text-gray-700">Valid Until:</strong>
                <p>{format(new Date(permit.validUntil), 'dd MMM yyyy, h:mm a')}</p>
                <strong className="font-medium text-gray-700">Approved By:</strong>
                <p>{permit.approvedBy || 'N/A'}</p>
              </div>
            </section>

            {/* Justification & QR Code */}
            <div className="mt-8 grid grid-cols-2 gap-8 items-start">
                <section>
                    <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4">AI Risk Justification</h2>
                    <div className="text-sm p-4 bg-gray-100 rounded-md border border-gray-200 italic">
                        {permit.justification}
                    </div>
                </section>
                <section className="flex flex-col items-center justify-center text-center">
                   <img
                      src={permit.qrCodeUrl}
                      alt={`QR Code for Permit ${permit.id}`}
                      width={140}
                      height={140}
                      crossOrigin="anonymous"
                   />
                   <p className="text-xs mt-2 text-gray-600">Scan to validate permit status</p>
                </section>
            </div>

            {/* Status History */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4">Status History</h2>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 font-semibold text-gray-600">Status</th>
                    <th className="p-2 font-semibold text-gray-600">Updated By</th>
                    <th className="p-2 font-semibold text-gray-600">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                   {[...permit.statusHistory].reverse().map((historyItem, index) => (
                     <tr key={index} className="border-b border-gray-200">
                       <td className="p-2">{historyItem.status}</td>
                       <td className="p-2">{historyItem.updatedBy}</td>
                       <td className="p-2">{format(new Date(historyItem.timestamp), 'dd MMM yyyy, h:mm a')}</td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </section>
          </main>

          <footer className="mt-10 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
              <p>This is a system-generated document for audit purposes.</p>
              <p>Generated on: {format(new Date(), 'dd MMM yyyy, h:mm:ss a')}</p>
          </footer>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Permit Details</DialogTitle>
            <DialogDescription>
              ID: {permit.id}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-[70vh] overflow-y-auto pr-2">
              
              <div className="space-y-4">
                  <div className="flex justify-between items-center">
                      <Badge variant="outline" className={cn('capitalize text-base font-semibold px-4 py-1', riskColorMap[permit.riskLevel])}>
                          {permit.riskLevel} Risk
                      </Badge>
                       <div className="flex items-center gap-2">
                          {statusIconMap[permit.status]}
                          <span className="font-semibold">{permit.status}</span>
                      </div>
                  </div>
                  
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                      <DetailRow
                          icon={<FileText className="h-5 w-5" />}
                          label="Work Description"
                          value={permit.description}
                      />
                      <DetailRow
                          icon={<Shield className="h-5 w-5" />}
                          label="Required PPE"
                          value={permit.ppeChecklist}
                      />
                      <DetailRow
                          icon={<User className="h-5 w-5" />}
                          label="Permit Issued By"
                          value={permit.issuedBy}
                      />
                      <DetailRow
                          icon={<UserCheck className="h-5 w-5" />}
                          label="Approved By"
                          value={permit.approvedBy || 'N/A'}
                      />
                      <DetailRow
                          icon={<Calendar className="h-5 w-5" />}
                          label="Issue Date"
                          value={format(new Date(permit.issueDate), 'dd MMM yyyy, h:mm a')}
                      />
                       <DetailRow
                          icon={<Clock className="h-5 w-5" />}
                          label="Permit Validity"
                          value={`${format(new Date(permit.validUntil), 'dd MMM yyyy, h:mm a')} (${formatDistanceToNow(new Date(permit.validUntil))} left)`}
                      />
                  </div>
                   <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                      <h4 className="font-bold text-yellow-800">AI Justification</h4>
                      <p className="mt-1 text-sm text-yellow-700">{permit.justification}</p>
                  </div>
              </div>

              <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><History className="h-5 w-5" /> Status History</h3>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                      <ul className="space-y-4">
                          {[...permit.statusHistory].reverse().map((historyItem, index) => (
                              <li key={index} className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                      <div className="rounded-full bg-primary/20 text-primary p-1.5">
                                          {historyItem.status === 'Created' && <FileText className="h-4 w-4" />}
                                          {historyItem.status === 'Approved' && <CheckCircle className="h-4 w-4" />}
                                          {historyItem.status === 'Rejected' && <XCircle className="h-4 w-4" />}
                                          {historyItem.status === 'Pending' && <AlertTriangle className="h-4 w-4" />}
                                      </div>
                                      {index < permit.statusHistory.length - 1 && (
                                          <div className="w-px h-full bg-border flex-1" />
                                      )}
                                  </div>
                                  <div>
                                      <p className="font-semibold">{historyItem.status}</p>
                                      <p className="text-sm text-muted-foreground">by {historyItem.updatedBy}</p>
                                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(historyItem.timestamp), { addSuffix: true })}</p>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
          <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                  {isExporting ? <Loader2 className="mr-2 animate-spin" /> : <FileDown className="mr-2" />}
                  Export PDF
              </Button>
              {canActionPermit && (
                  <div className="flex gap-2">
                      <Button variant="destructive" onClick={() => handleDecision('Rejected')} disabled={isActionPending}>
                          {isActionPending ? <Loader2 className="mr-2 animate-spin" /> : <Ban className="mr-2" />}
                           Reject
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleDecision('Approved')} disabled={isActionPending}>
                         {isActionPending ? <Loader2 className="mr-2 animate-spin" /> : <Check className="mr-2" />}
                          Approve
                      </Button>
                  </div>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
