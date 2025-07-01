export type RiskLevel = 'low' | 'medium' | 'high';
export type PermitStatus = 'Approved' | 'Pending' | 'Rejected';
export type Department =
  | 'Administration'
  | 'Alumina Plant'
  | 'Carbon Plant'
  | 'Cast House'
  | 'Civil Maintenance'
  | 'Electrical Maintenance'
  | 'Environment'
  | 'Finance'
  | 'Fire and Safety'
  | 'Human Resources'
  | 'HVAC'
  | 'Instrumentation'
  | 'IT'
  | 'Laboratory'
  | 'Logistics'
  | 'Maintenance'
  | 'Mechanical Maintenance'
  | 'Power Plant'
  | 'Procurement'
  | 'Production'
  | 'Quality Control'
  | 'Rectifier'
  | 'Safety'
  | 'Security'
  | 'Smelter';

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
  issuedById: string;
  issuedBy: string;
  approvedBy?: string;
  issueDate: string; // ISO Date String
  validUntil: string; // ISO Date String
  statusHistory: {
      status: PermitStatus | 'Created';
      timestamp: string;
      updatedBy: string;
  }[];
};

export type NotificationType = 'visitor_request' | 'permit_approval' | 'permit_status_update';

export interface Notification {
  id: string;
  recipientId: string; // Employee ID
  type: NotificationType;
  title: string;
  description: string;
  isRead: boolean;
  timestamp: string; // ISO String
  payload: {
    permitId?: string;
    visitorRequestId?: string;
    status?: string;
  };
}


export interface Employee {
  id: string; // Employee Code
  dob: string; // YYYY-MM-DD
  name: string;
  avatarUrl?: string;
  avatarHint: string;
  type: 'employee';
  department: Department;
  designation: string;
}

export interface Visitor {
  id: string; // Visitor ID
  dob: string; // YYYY-MM-DD
  name: string;
  avatarUrl?: string;
  avatarHint: string;
  entryTime: string; // ISO 8601 string
  validUntil: string; // ISO 8601 string
  type: 'visitor';
  lat?: number;
  lng?: number;
}


export type VisitorRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface VisitorRequest {
  id: string;
  visitorName: string;
  visitorDob: string; // YYYY-MM-DD
  purpose: string;
  employeeToVisitId: string;
  employeeToVisitName: string;
  requestedBy: string; // Employee ID of requester (Security)
  status: VisitorRequestStatus;
  timestamp: string; // ISO String
  statusHistory: {
    status: VisitorRequestStatus | 'Requested';
    timestamp: string;
    updatedBy: string;
    updatedById: string;
  }[];
  generatedVisitorId?: string;
}
