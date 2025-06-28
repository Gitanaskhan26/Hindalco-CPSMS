export type RiskLevel = 'low' | 'medium' | 'high';
export type PermitStatus = 'Approved' | 'Pending' | 'Rejected';

export type Permit = {
  id: string;
  description: string;
  ppeChecklist: string;
  riskLevel: RiskLevel;
  justification: string;
  lat: number;
  lng: number;
  qrCodeUrl: string;
  status: PermitStatus;
};
