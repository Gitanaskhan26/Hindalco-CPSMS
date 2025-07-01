
'use client';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import { useNotification } from '@/context/notification-context';
import { useRefresh } from '@/context/refresh-context';
import type { Visitor, VisitorRequest } from '@/lib/types';
import { handleVisitorRequestDecision, getVisitorById, getVisitorRequestById } from '@/lib/actions';
import { Check, Ban, User, Building, FileText, Loader2, AlertTriangle, CheckCircle, XCircle, UserCheck, History, Clock, Calendar, FileDown, ShieldCheck, QrCode, UserPlus, Cake } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import HindalcoLogoAsset from '@/components/Assets/HINDALCO-logo.ico';

interface VisitorRequestDetailsDialogProps {
    request: VisitorRequest | null;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    notificationId: string;
}

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-4 py-3 border-b last:border-b-0">
        <div className="flex-shrink-0 text-muted-foreground pt-1">{icon}</div>
        <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground break-words">{value}</p>
        </div>
    </div>
);

const statusIconMap: Record<VisitorRequest['status'], React.ReactElement> = {
    Approved: <CheckCircle className="h-4 w-4 text-green-600" />,
    Pending: <AlertTriangle className="h-4 w-4 text-orange-500" />,
    Rejected: <XCircle className="h-4 w-4 text-destructive" />,
};

export function VisitorRequestDetailsDialog({ request, isOpen, onOpenChange, notificationId }: VisitorRequestDetailsDialogProps) {
    const { user } = useUser();
    const { reloadNotifications } = useNotification();
    const { triggerRefresh } = useRefresh();
    const { toast } = useToast();
    const [isActionPending, setIsActionPending] = React.useState(false);
    const [visitorDetails, setVisitorDetails] = React.useState<Visitor | null>(null);
    const [isExporting, setIsExporting] = React.useState(false);
    const printableRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen && request?.status === 'Approved' && request.generatedVisitorId) {
            const fetchVisitor = async () => {
                const visitor = await getVisitorById(request.generatedVisitorId!);
                setVisitorDetails(visitor);
            };
            fetchVisitor();
        } else {
            setVisitorDetails(null);
        }
    }, [request, isOpen]);
    
    const onDecision = async (decision: 'Approved' | 'Rejected') => {
        if (!request || !user || user.type !== 'employee' || !notificationId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not process request. Missing required information.' });
            return;
        }

        setIsActionPending(true);
        try {
            const result = await handleVisitorRequestDecision(request.id, decision, user.id, user.name, notificationId);
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
        if (!printableRef.current || !request || !visitorDetails) return;
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
          pdf.save(`VisitorPass-${visitorDetails.name.replace(/\s+/g, '_')}.pdf`);
    
        } catch (error) {
          console.error("Failed to export PDF", error);
        } finally {
          setIsExporting(false);
        }
      };


    if (!request) return null;

    const isActionable = user?.type === 'employee' && 
                          request.status === 'Pending' && 
                          user.id === request.employeeToVisitId;

    const lastAction = request.statusHistory[request.statusHistory.length - 1];

    const qrCodeUrl = visitorDetails
      ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ id: visitorDetails.id, name: visitorDetails.name, type: 'visitor-pass' }))}`
      : '';
          
    return (
    <>
      {/* Hidden printable component */}
      {isOpen && visitorDetails && request && (
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
                        <h1 className="text-3xl font-bold text-gray-800">Visitor Pass</h1>
                        <p className="text-gray-600">Hindalco Industries Ltd.</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Visitor ID</p>
                    <p className="font-mono text-lg font-semibold">{visitorDetails.id}</p>
                </div>
            </header>

            <main className="mt-8">
                {/* Summary Box */}
                <div className="grid grid-cols-3 gap-px rounded-lg border border-gray-300 bg-gray-300 overflow-hidden">
                    <div className="bg-white p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                        <p className="font-bold text-lg">{request.status}</p>
                    </div>
                    <div className="bg-white p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Visitor Name</p>
                        <p className="font-bold text-lg">{request.visitorName}</p>
                    </div>
                    <div className="bg-white p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">To Visit</p>
                        <p className="font-bold text-lg">{request.employeeToVisitName}</p>
                    </div>
                </div>
                
                 <div className="mt-8 grid grid-cols-3 gap-8">
                     {/* Details Column */}
                    <div className="col-span-2">
                         <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4">Pass Details</h2>
                         <div className="space-y-3">
                             <div className="grid grid-cols-[120px_1fr]"><strong className="font-medium text-gray-700">Visitor Name:</strong><p>{request.visitorName}</p></div>
                             <div className="grid grid-cols-[120px_1fr]"><strong className="font-medium text-gray-700">Date of Birth:</strong><p>{format(new Date(visitorDetails.dob), 'PPP')}</p></div>
                             <div className="grid grid-cols-[120px_1fr]"><strong className="font-medium text-gray-700">Purpose of Visit:</strong><p>{request.purpose}</p></div>
                             <div className="grid grid-cols-[120px_1fr]"><strong className="font-medium text-gray-700">Requested By:</strong><p>{request.statusHistory.find(h => h.status === 'Requested')?.updatedBy || 'N/A'}</p></div>
                             <div className="grid grid-cols-[120px_1fr]"><strong className="font-medium text-gray-700">Approved By:</strong><p>{lastAction.updatedBy}</p></div>
                             <div className="grid grid-cols-[120px_1fr]"><strong className="font-medium text-gray-700">Issue Date:</strong><p>{format(new Date(visitorDetails.entryTime), 'dd MMM yyyy, h:mm a')}</p></div>
                             <div className="grid grid-cols-[120px_1fr]"><strong className="font-medium text-gray-700">Valid Until:</strong><p>{format(new Date(visitorDetails.validUntil), 'dd MMM yyyy, h:mm a')}</p></div>
                         </div>
                    </div>
                    {/* QR Code Column */}
                    <div className="col-span-1 flex flex-col items-center justify-start text-center pt-12">
                       <img
                          src={qrCodeUrl}
                          alt={`QR Code for Visitor ${visitorDetails.name}`}
                          width={140}
                          height={140}
                          crossOrigin="anonymous"
                       />
                       <p className="text-xs mt-2 text-gray-600">Scan for verification</p>
                    </div>
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
                           {[...request.statusHistory].reverse().map((historyItem, index) => (
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
                    <DialogTitle className="text-2xl">Visitor Pass Request Details</DialogTitle>
                    <DialogDescription>
                        Request ID: {request.id}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="space-y-4">
                        <div className="flex justify-end items-center gap-2">
                            {statusIconMap[request.status]}
                            <span className="font-semibold">{request.status}</span>
                        </div>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                            <DetailRow icon={<User className="h-5 w-5" />} label="Visitor Name" value={request.visitorName} />
                             <DetailRow icon={<Cake className="h-5 w-5" />} label="Visitor Date of Birth" value={format(new Date(request.visitorDob), 'PPP')} />
                            <DetailRow icon={<ShieldCheck className="h-5 w-5" />} label="Employee to Visit" value={request.employeeToVisitName} />
                            <DetailRow icon={<FileText className="h-5 w-5" />} label="Purpose of Visit" value={request.purpose} />
                        </div>
                         {request.status !== 'Pending' && (
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                                <h3 className="font-bold mb-2">Decision Details</h3>
                                <DetailRow icon={<UserCheck className="h-5 w-5" />} label="Actioned By" value={lastAction.updatedBy} />
                                <DetailRow icon={<Clock className="h-5 w-5" />} label="Action Time" value={format(new Date(lastAction.timestamp), 'dd MMM yyyy, h:mm a')} />
                            </div>
                        )}
                        {visitorDetails && (
                             <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                                <h3 className="font-bold mb-2">Generated Pass Details</h3>
                                <DetailRow icon={<User className="h-5 w-5" />} label="Visitor ID" value={visitorDetails.id} />
                                <DetailRow icon={<Calendar className="h-5 w-5" />} label="Issue Date" value={format(new Date(visitorDetails.entryTime), 'dd MMM yyyy, h:mm a')} />
                                <DetailRow icon={<Clock className="h-5 w-5" />} label="Valid Until" value={format(new Date(visitorDetails.validUntil), 'dd MMM yyyy, h:mm a')} />
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2"><History className="h-5 w-5" /> Status History</h3>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                            <ul className="space-y-4">
                                {[...request.statusHistory].reverse().map((historyItem, index) => (
                                    <li key={index} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="rounded-full bg-primary/20 text-primary p-1.5">
                                                {historyItem.status === 'Requested' && <UserPlus className="h-4 w-4" />}
                                                {historyItem.status === 'Approved' && <CheckCircle className="h-4 w-4" />}
                                                {historyItem.status === 'Rejected' && <XCircle className="h-4 w-4" />}
                                                {historyItem.status === 'Pending' && <AlertTriangle className="h-4 w-4" />}
                                            </div>
                                            {index < request.statusHistory.length - 1 && (
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
                     <div className="flex gap-2">
                        {request.status === 'Approved' && visitorDetails && (
                            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                                {isExporting ? <Loader2 className="mr-2 animate-spin" /> : <FileDown className="mr-2" />}
                                Export PDF
                            </Button>
                        )}
                    </div>

                    {isActionable && (
                        <div className="flex gap-2">
                            <Button variant="destructive" onClick={() => onDecision('Rejected')} disabled={isActionPending}>
                                {isActionPending ? <Loader2 className="mr-2 animate-spin" /> : <Ban className="mr-2" />}
                                Reject
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => onDecision('Approved')} disabled={isActionPending}>
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
