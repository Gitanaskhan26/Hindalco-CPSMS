export type RiskLevel = 'low' | 'medium' | 'high';

export type Permit = {
  id: string;
  description: string;
  ppeChecklist: string;
  riskLevel: RiskLevel;
  justification: string;
  lat: number;
  lng: number;
  qrCodeUrl: string;
};
