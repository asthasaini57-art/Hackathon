export type DamageCategory =
  | 'Roads & Pavement'
  | 'Street Lighting'
  | 'Water & Drainage'
  | 'Parks & Recreation'
  | 'Public Transit & Signage'
  | 'Sanitation & Waste';

export type HazardSeverity =
  | 'Critical Hazard'
  | 'High Urgency'
  | 'Moderate'
  | 'Minor Maintenance';

export type ReportStatus =
  | 'Under Review'
  | 'Dispatched to Crew'
  | 'Work In Progress'
  | 'Resolved';

export interface WardLeader {
  id: string;
  name: string;
  role: string;
  party: string;
  wardId: string;
  wardName: string;
  term: string;
  avatarUrl?: string;
  officeEmail: string;
  contactNumber: string;
  totalReports: number;
  resolvedReports: number;
  inProgressReports: number;
  pendingReports: number;
  avgResolutionDays: number;
  accountabilityScore: number; // 0 - 100
  citizenApproval: number; // 0 - 100%
  topFocusArea: string;
  statement: string;
}

export interface TimelineEntry {
  id: string;
  date: string;
  status: ReportStatus;
  note: string;
  actor: string;
}

export interface DamageReport {
  id: string;
  trackingToken: string;
  title: string;
  description: string;
  category: DamageCategory;
  severity: HazardSeverity;
  status: ReportStatus;
  imageUrl: string;
  resolvedImageUrl?: string;
  location: {
    address: string;
    wardId: string;
    wardName: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  assignedLeader: {
    id: string;
    name: string;
    role: string;
    party: string;
    wardId: string;
  };
  department: string;
  reportedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  daysOpen: number;
  upvotes: number;
  hasUpvoted?: boolean;
  aiAnalysis?: {
    hazardScore: number; // 1-100
    safetyRisk: string;
    urgencyText: string;
    recommendedDepartment: string;
    actionRequired: string;
    anonymityVerified: boolean;
  };
  timeline: TimelineEntry[];
  resolutionNotes?: string;
}

export interface AIAnalysisResult {
  title: string;
  category: DamageCategory;
  severity: HazardSeverity;
  department: string;
  safetyRisk: string;
  urgencyText: string;
  actionRequired: string;
  hazardScore: number;
}

export type UserRole = 'anonymous_citizen' | 'registered_citizen' | 'municipal_official';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  isAnonymous: boolean;
  avatarInitials: string;
  wardJurisdiction?: string;
  officialTitle?: string;
  email?: string;
}
