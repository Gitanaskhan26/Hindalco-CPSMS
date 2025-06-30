export type RiskLevel = 'low' | 'medium' | 'high';
export type PermitStatus = 'Approved' | 'Pending' | 'Rejected';
export type Department = 'Safety' | 'Security' | 'Maintenance' | 'Production';

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

export interface Employee {
  id: string; // Employee Code
  dob: string; // YYYY-MM-DD
  name: string;
  avatarUrl: string;
  avatarHint: string;
  type: 'employee';
  department: Department;
  designation: string;
}

export interface Visitor {
  id: string; // Visitor ID
  dob: string; // YYYY-MM-DD
  name: string;
  avatarUrl: string;
  avatarHint: string;
  entryTime: string; // ISO 8601 string
  validUntil: string; // ISO 8601 string
  type: 'visitor';
  lat?: number;
  lng?: number;
}
