
'use client';

import * as React from 'react';
import jsQR from 'jsqr';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode, Loader2 } from 'lucide-react';
import { PermitDetailsDialog } from '@/components/permit-details-dialog';
import { getPermitById } from '@/lib/actions';
import type { Permit } from '@/lib/types';

export default function ScanPage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [scannedPermit, setScannedPermit] = React.useState<Permit | null>(null);
  const { toast } = useToast();

  const handleScan = React.useCallback(async (data: string) => {
    setIsProcessing(true);
    try {
      const parsedData = JSON.parse(data);
      if (parsedData && parsedData.id) {
        const permit = await getPermitById(parsedData.id);
        if (permit) {
          setScannedPermit(permit);
        } else {
          toast({ variant: 'destructive', title: 'Invalid Permit', description: 'The scanned permit ID does not exist.' });
          setIsProcessing(false); // Allow re-scanning
        }
      } else {
        toast({ variant: 'destructive', title: 'Invalid QR Code', description: 'The QR code format is not recognized.' });
        setIsProcessing(false); // Allow re-scanning
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Scan Error', description: 'Could not process the QR code.' });
      setIsProcessing(false); // Allow re-scanning
    }
  }, [toast]);
  
  React.useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        const ctx = canvas.getContext('2d');
        if(ctx){
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code) {
              if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
              }
              cancelAnimationFrame(animationFrameId);
              handleScan(code.data);
              return;
            }
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          animationFrameId = requestAnimationFrame(tick);
        }
      } catch (error) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    if (!isProcessing && !scannedPermit) {
      getCameraPermission();
    }

    return () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
        cancelAnimationFrame(animationFrameId);
    }
  }, [isProcessing, scannedPermit, toast, handleScan]);
  
  const handleDialogClose = () => {
    setScannedPermit(null);
    setIsProcessing(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Scan Permit QR Code</h1>
          <p className="text-muted-foreground mb-6 text-center">Point your camera at a permit's QR code to validate it.</p>
          
          <div className="w-full max-w-md bg-card rounded-xl shadow-lg border p-4">
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {isProcessing && !scannedPermit && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-20">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="mt-2 font-semibold">Processing QR Code...</p>
                </div>
              )}
              {!isProcessing && (
                <div className="absolute inset-0 bg-transparent flex items-center justify-center z-10">
                    <div className="w-2/3 h-2/3 border-4 border-dashed border-white/50 rounded-lg" />
                </div>
              )}
            </div>
          
            {hasCameraPermission === false && (
              <Alert variant="destructive" className="mt-4">
                <QrCode className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser to use this feature.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
      <PermitDetailsDialog
        isOpen={!!scannedPermit}
        onOpenChange={(open) => {
          if(!open) handleDialogClose();
        }}
        permit={scannedPermit}
        notificationId=""
      />
    </>
  );
}
