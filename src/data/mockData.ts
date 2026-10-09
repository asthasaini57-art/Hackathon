import { DamageReport, WardLeader } from '../types';

export const INITIAL_LEADERS: WardLeader[] = [
  {
    id: 'leader-ward-04',
    name: 'Elena Rostova',
    role: 'City Councillor, Ward 4',
    party: 'Civic Renewal Alliance',
    wardId: 'ward-04',
    wardName: 'Ward 4 - Riverside & Metro Core',
    term: '2023 – 2027',
    officeEmail: 'elena.rostova@metro.gov',
    contactNumber: '+1 (555) 014-4902',
    totalReports: 42,
    resolvedReports: 36,
    inProgressReports: 4,
    pendingReports: 2,
    avgResolutionDays: 2.8,
    accountabilityScore: 89,
    citizenApproval: 86,
    topFocusArea: 'Rapid Road Resurfacing & Pedestrian Safety',
    statement: 'Public infrastructure is a fundamental civic right. Every anonymous report in Ward 4 receives same-day municipal inspection and transparent status tracking.'
  },
  {
    id: 'leader-ward-12',
    name: 'Sarah Chen',
    role: 'City Councillor, Ward 12',
    party: 'United Green Caucus',
    wardId: 'ward-12',
    wardName: 'Ward 12 - Greenwood & South Hills',
    term: '2024 – 2028',
    officeEmail: 'sarah.chen@metro.gov',
    contactNumber: '+1 (555) 018-9921',
    totalReports: 38,
    resolvedReports: 34,
    inProgressReports: 3,
    pendingReports: 1,
    avgResolutionDays: 2.3,
    accountabilityScore: 92,
    citizenApproval: 91,
    topFocusArea: 'Public Parks Maintenance & Clean Stormwater Systems',
    statement: 'Zero tolerance for broken community spaces. We prioritize park equipment safety and clean drainage before minor issues escalate into hazardous conditions.'
  },
  {
    id: 'leader-ward-07',
    name: 'Marcus Vance',
    role: 'City Councillor, Ward 7',
    party: 'Progressive Urban Forum',
    wardId: 'ward-07',
    wardName: 'Ward 7 - Highland Tech District',
    term: '2022 – 2026',
    officeEmail: 'marcus.vance@metro.gov',
    contactNumber: '+1 (555) 012-3340',
    totalReports: 35,
    resolvedReports: 23,
    inProgressReports: 8,
    pendingReports: 4,
    avgResolutionDays: 5.4,
    accountabilityScore: 66,
    citizenApproval: 64,
    topFocusArea: 'Modernized Grid Lighting & Digital Transit Corridors',
    statement: 'Navigating municipal budget allocation across rapid tech zone growth. Actively working to accelerate turnaround times for water main repairs.'
  },
  {
    id: 'leader-ward-18',
    name: 'Donald Sterling',
    role: 'City Councillor, Ward 18',
    party: 'Independent Civic Action',
    wardId: 'ward-18',
    wardName: 'Ward 18 - East Industrial Corridor',
    term: '2021 – 2025',
    officeEmail: 'donald.sterling@metro.gov',
    contactNumber: '+1 (555) 019-7711',
    totalReports: 49,
    resolvedReports: 20,
    inProgressReports: 11,
    pendingReports: 18,
    avgResolutionDays: 9.8,
    accountabilityScore: 41,
    citizenApproval: 38,
    topFocusArea: 'Industrial Heavy Freight Bypass Roads',
    statement: 'Industrial zoning presents complex jurisdiction challenges between county and city authorities. We encourage citizens to flag critical road damage.'
  }
];

export const INITIAL_REPORTS: DamageReport[] = [
  {
    id: 'REP-2026-001',
    trackingToken: 'ANON-8842-1A',
    title: 'Severe Asphalt Crater & Subsurface Pothole',
    description: 'Deep road crater developing at the intersection of Market & 4th Avenue. Vehicles swerving into oncoming traffic to avoid rim and suspension damage.',
    category: 'Roads & Pavement',
    severity: 'Critical Hazard',
    status: 'Dispatched to Crew',
    imageUrl: '/src/assets/images/damage_pothole_crater_1791530885839.jpg',
    location: {
      address: 'Intersection of 4th Ave & Market St',
      wardId: 'ward-04',
      wardName: 'Ward 4 - Riverside & Metro Core',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    assignedLeader: {
      id: 'leader-ward-04',
      name: 'Elena Rostova',
      role: 'City Councillor, Ward 4',
      party: 'Civic Renewal Alliance',
      wardId: 'ward-04'
    },
    department: 'Department of Public Works - Roadway Division',
    reportedAt: '2026-10-07T08:15:00Z',
    updatedAt: '2026-10-08T11:30:00Z',
    daysOpen: 2,
    upvotes: 47,
    aiAnalysis: {
      hazardScore: 94,
      safetyRisk: 'High vehicular accident risk; potential tire blowout and cyclist injury.',
      urgencyText: 'Dispatch asphalt patching crew within 12 hours.',
      recommendedDepartment: 'Department of Public Works - Roadway Division',
      actionRequired: 'Excavate loose gravel, apply hot-mix bituminous asphalt, compact to grade.',
      anonymityVerified: true
    },
    timeline: [
      {
        id: 't-1',
        date: '2026-10-07 08:15',
        status: 'Under Review',
        note: 'Anonymous citizen submission received. Automated privacy scrub cleared (zero personal metadata stored).',
        actor: 'Fixora Gateway'
      },
      {
        id: 't-2',
        date: '2026-10-07 09:20',
        status: 'Dispatched to Crew',
        note: 'Ward 4 Office assigned Ticket #PW-9902. Emergency asphalt crew scheduled for inspection.',
        actor: 'Elena Rostova Office / DPW Dispatch'
      }
    ]
  },
  {
    id: 'REP-2026-002',
    trackingToken: 'ANON-3914-7X',
    title: 'Bent Light Pole with Shattered Lantern Head',
    description: 'Structural vehicle impact bent street light pole to 45 degrees. Shattered lantern head left live wiring near pedestrian crossing in front of Oak St bakery.',
    category: 'Street Lighting',
    severity: 'Critical Hazard',
    status: 'Work In Progress',
    imageUrl: '/src/assets/images/damage_broken_streetlight_1791530904501.jpg',
    location: {
      address: '228 Oak Street, Near Crosswalk',
      wardId: 'ward-07',
      wardName: 'Ward 7 - Highland Tech District',
      coordinates: { lat: 37.7833, lng: -122.4167 }
    },
    assignedLeader: {
      id: 'leader-ward-07',
      name: 'Marcus Vance',
      role: 'City Councillor, Ward 7',
      party: 'Progressive Urban Forum',
      wardId: 'ward-07'
    },
    department: 'Municipal Electrical & Utility Services',
    reportedAt: '2026-10-06T14:40:00Z',
    updatedAt: '2026-10-08T16:00:00Z',
    daysOpen: 3,
    upvotes: 32,
    aiAnalysis: {
      hazardScore: 91,
      safetyRisk: 'Exposed high-voltage conduit and falling structural hazard over sidewalk.',
      urgencyText: 'Immediate electrical circuit isolation and barricade setup.',
      recommendedDepartment: 'Municipal Electrical & Utility Services',
      actionRequired: 'Isolate circuit breaker, crane-extract damaged mast arm, install replacement LED luminaire.',
      anonymityVerified: true
    },
    timeline: [
      {
        id: 't-3',
        date: '2026-10-06 14:40',
        status: 'Under Review',
        note: 'Anonymous incident reported. High priority alert routed to Ward 7 utility desk.',
        actor: 'Fixora Gateway'
      },
      {
        id: 't-4',
        date: '2026-10-07 08:00',
        status: 'Dispatched to Crew',
        note: 'Utility technician confirmed circuit isolated at substation junction.',
        actor: 'Municipal Electrical Services'
      },
      {
        id: 't-5',
        date: '2026-10-08 14:15',
        status: 'Work In Progress',
        note: 'Replacement pole assembly staged on site. Crew bolting foundation anchor flange.',
        actor: 'Field Crew Alpha'
      }
    ]
  },
  {
    id: 'REP-2026-003',
    trackingToken: 'ANON-5521-2B',
    title: 'Ruptured Water Main Flooding Sidewalk & Curb',
    description: 'Subterranean supply pipe burst beneath curb edge. Continuous clean water gushing down gutter into storm drain, causing asphalt softening.',
    category: 'Water & Drainage',
    severity: 'High Urgency',
    status: 'Work In Progress',
    imageUrl: '/src/assets/images/damage_burst_water_pipe_1791530918464.jpg',
    location: {
      address: '512 Elmwood Avenue, North Curb',
      wardId: 'ward-18',
      wardName: 'Ward 18 - East Industrial Corridor',
      coordinates: { lat: 37.7651, lng: -122.4050 }
    },
    assignedLeader: {
      id: 'leader-ward-18',
      name: 'Donald Sterling',
      role: 'City Councillor, Ward 18',
      party: 'Independent Civic Action',
      wardId: 'ward-18'
    },
    department: 'Metropolitan Water Reclamation & Supply Authority',
    reportedAt: '2026-10-04T10:00:00Z',
    updatedAt: '2026-10-08T09:00:00Z',
    daysOpen: 5,
    upvotes: 68,
    aiAnalysis: {
      hazardScore: 82,
      safetyRisk: 'Subsurface soil erosion and water loss; risk of sinkhole collapse under curb.',
      urgencyText: 'Emergency valve shutdown within 4 hours.',
      recommendedDepartment: 'Metropolitan Water Reclamation & Supply Authority',
      actionRequired: 'Isolate main valve branch, trench repair section with ductile iron sleeve, backfill aggregate.',
      anonymityVerified: true
    },
    timeline: [
      {
        id: 't-6',
        date: '2026-10-04 10:00',
        status: 'Under Review',
        note: 'Reported by local neighborhood resident anonymously.',
        actor: 'Fixora Gateway'
      },
      {
        id: 't-7',
        date: '2026-10-06 11:30',
        status: 'Dispatched to Crew',
        note: 'Notice passed to Ward 18 representative office after 48h delay.',
        actor: 'Municipal Dispatch'
      },
      {
        id: 't-8',
        date: '2026-10-08 09:00',
        status: 'Work In Progress',
        note: 'Water gate valve clamped. Heavy machinery dispatched for trenching.',
        actor: 'Water Authority Team 4'
      }
    ]
  },
  {
    id: 'REP-2026-004',
    trackingToken: 'ANON-9012-4C',
    title: 'Splintered Park Bench with Twisted Cast Frame',
    description: 'Community park bench splintered in center with jagged wood shards and detached iron arm. Children play in adjacent lawn area.',
    category: 'Parks & Recreation',
    severity: 'Moderate',
    status: 'Resolved',
    imageUrl: '/src/assets/images/damage_broken_park_bench_1791530930412.jpg',
    location: {
      address: 'Pinecrest Community Park, East Pathway',
      wardId: 'ward-12',
      wardName: 'Ward 12 - Greenwood & South Hills',
      coordinates: { lat: 37.7580, lng: -122.4350 }
    },
    assignedLeader: {
      id: 'leader-ward-12',
      name: 'Sarah Chen',
      role: 'City Councillor, Ward 12',
      party: 'United Green Caucus',
      wardId: 'ward-12'
    },
    department: 'Parks, Forestry & Public Amenities',
    reportedAt: '2026-10-05T12:00:00Z',
    updatedAt: '2026-10-07T15:20:00Z',
    resolvedAt: '2026-10-07T15:20:00Z',
    daysOpen: 2,
    upvotes: 19,
    aiAnalysis: {
      hazardScore: 68,
      safetyRisk: 'Puncture and splinter hazard for park visitors and children.',
      urgencyText: 'Schedule bench removal or slat replacement within 48 hours.',
      recommendedDepartment: 'Parks, Forestry & Public Amenities',
      actionRequired: 'Replace timber slats with weatherized composite planks; tighten anchor bolts.',
      anonymityVerified: true
    },
    timeline: [
      {
        id: 't-9',
        date: '2026-10-05 12:00',
        status: 'Under Review',
        note: 'Anonymous submission logged with photo attachment.',
        actor: 'Fixora Gateway'
      },
      {
        id: 't-10',
        date: '2026-10-06 09:10',
        status: 'Dispatched to Crew',
        note: 'Ward 12 Parks crew expedited work order #PK-441.',
        actor: 'Sarah Chen Office'
      },
      {
        id: 't-11',
        date: '2026-10-07 15:20',
        status: 'Resolved',
        note: 'Damaged wooden slats replaced with recycled polymer composite lumber. Structural bolts secured.',
        actor: 'Parks Maintenance Crew'
      }
    ],
    resolutionNotes: 'Repaired by Ward 12 rapid amenities team within 48 hours. Photo verified by municipal park ranger.'
  }
];
