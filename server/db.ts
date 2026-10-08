import bcrypt from "bcryptjs";
import {
  DepartmentRecord,
  EmployeeRecord,
  EmployeeRiskRecord,
  FeedbackAnalysisRecord,
  FeedbackRecord,
  GoalRecord,
  NotificationRecord,
  RiskLevel,
  UserRecord,
} from "./types.js";

class Database {
  users: UserRecord[] = [];
  employees: EmployeeRecord[] = [];
  departments: DepartmentRecord[] = [];
  feedbacks: FeedbackRecord[] = [];
  feedbackAnalyses: FeedbackAnalysisRecord[] = [];
  employeeRisks: EmployeeRiskRecord[] = [];
  goals: GoalRecord[] = [];
  notifications: NotificationRecord[] = [];

  constructor() {
    this.seed();
  }

  seed() {
    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync("Admin@123", salt);
    const empHash = bcrypt.hashSync("Employee@123", salt);

    // 1. Users
    const adminUser: UserRecord = {
      id: "usr-admin-1",
      email: "admin@company.com",
      passwordHash: adminHash,
      role: "HR_ADMIN",
      name: "Sarah Jenkins",
      createdAt: "2024-01-10T08:00:00.000Z",
    };

    const userAlex: UserRecord = {
      id: "usr-emp-1",
      email: "alex.morgan@company.com",
      passwordHash: empHash,
      role: "EMPLOYEE",
      name: "Alex Morgan",
      createdAt: "2024-02-15T09:00:00.000Z",
    };

    const userPriya: UserRecord = {
      id: "usr-emp-2",
      email: "priya.sharma@company.com",
      passwordHash: empHash,
      role: "EMPLOYEE",
      name: "Priya Sharma",
      createdAt: "2024-03-01T09:00:00.000Z",
    };

    const userDavid: UserRecord = {
      id: "usr-emp-3",
      email: "david.chen@company.com",
      passwordHash: empHash,
      role: "EMPLOYEE",
      name: "David Chen",
      createdAt: "2024-03-15T09:00:00.000Z",
    };

    const userRachel: UserRecord = {
      id: "usr-emp-4",
      email: "rachel.green@company.com",
      passwordHash: empHash,
      role: "EMPLOYEE",
      name: "Rachel Green",
      createdAt: "2024-04-01T09:00:00.000Z",
    };

    const userMarcus: UserRecord = {
      id: "usr-emp-5",
      email: "marcus.vance@company.com",
      passwordHash: empHash,
      role: "EMPLOYEE",
      name: "Marcus Vance",
      createdAt: "2024-04-20T09:00:00.000Z",
    };

    const userCarlos: UserRecord = {
      id: "usr-emp-6",
      email: "carlos.rodriguez@company.com",
      passwordHash: empHash,
      role: "EMPLOYEE",
      name: "Carlos Rodriguez",
      createdAt: "2024-05-10T09:00:00.000Z",
    };

    const userSophia: UserRecord = {
      id: "usr-emp-7",
      email: "sophia.patel@company.com",
      passwordHash: empHash,
      role: "EMPLOYEE",
      name: "Sophia Patel",
      createdAt: "2024-06-01T09:00:00.000Z",
    };

    const userSobhiya: UserRecord = {
      id: "usr-emp-sobhiya",
      email: "sobhiyalogu2005@gmail.com",
      passwordHash: empHash,
      role: "EMPLOYEE",
      name: "Sobhiya Logu",
      createdAt: "2024-01-10T09:00:00.000Z",
    };

    this.users = [
      adminUser,
      userSobhiya,
      userAlex,
      userPriya,
      userDavid,
      userRachel,
      userMarcus,
      userCarlos,
      userSophia,
    ];

    // 2. Departments
    this.departments = [
      {
        id: "dept-1",
        name: "Engineering",
        code: "ENG",
        description: "Core cloud infrastructure, distributed microservices, and product software engineering.",
        managerName: "Vikram Malhotra",
        budgetAllocated: 1250000,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "dept-2",
        name: "HR & People Ops",
        code: "HR",
        description: "Talent acquisition, employee experience, culture, and organizational learning.",
        managerName: "Sarah Jenkins",
        budgetAllocated: 450000,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "dept-3",
        name: "Finance & Accounting",
        code: "FIN",
        description: "Financial planning, treasury, payroll, and risk compliance management.",
        managerName: "Robert Sterling",
        budgetAllocated: 520000,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "dept-4",
        name: "Marketing & Growth",
        code: "MKT",
        description: "Brand design, content strategy, performance marketing, and developer relations.",
        managerName: "Elena Rostova",
        budgetAllocated: 680000,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "dept-5",
        name: "Sales & Partnerships",
        code: "SLS",
        description: "Enterprise deals, business development, and strategic client account management.",
        managerName: "Jordan Belford",
        budgetAllocated: 890000,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "dept-6",
        name: "Operations & Facilities",
        code: "OPS",
        description: "Workplace logistics, hardware procurement, office health & safety.",
        managerName: "Arthur Pendelton",
        budgetAllocated: 380000,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "dept-7",
        name: "Customer Support & Success",
        code: "SUP",
        description: "24/7 technical customer support, tier-2 escalation, and SLA monitoring.",
        managerName: "Nathalie Dupont",
        budgetAllocated: 490000,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];

    // 3. Employees
    this.employees = [
      {
        id: "emp-1",
        userId: userAlex.id,
        employeeCode: "EMP-101",
        name: "Alex Morgan",
        email: userAlex.email,
        departmentId: "dept-1",
        designation: "Senior Backend Engineer",
        experienceYears: 6,
        joiningDate: "2023-03-15",
        status: "ACTIVE",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        performanceScore: 84,
        managerName: "Vikram Malhotra",
        projects: ["Payment Gateway v2", "Event Sourcing Pipeline", "PCI Compliance"],
        achievements: ["Q4 Engineering MVP", "Patented Distributed Locking Algorithm"],
        certifications: ["AWS Certified Solutions Architect Professional", "Certified Kubernetes Administrator"],
        createdAt: "2023-03-15T00:00:00.000Z",
      },
      {
        id: "emp-2",
        userId: userPriya.id,
        employeeCode: "EMP-102",
        name: "Priya Sharma",
        email: userPriya.email,
        departmentId: "dept-1",
        designation: "Staff Full-Stack Engineer",
        experienceYears: 7,
        joiningDate: "2022-08-01",
        status: "ACTIVE",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        performanceScore: 92,
        managerName: "Vikram Malhotra",
        projects: ["Design System UI Lib", "Customer Portal NextJS", "GraphQL Gateway"],
        achievements: ["Hackathon Winner 2024", "Mentored 5 junior developers"],
        certifications: ["Google Cloud Certified Professional Cloud Architect"],
        createdAt: "2022-08-01T00:00:00.000Z",
      },
      {
        id: "emp-3",
        userId: userDavid.id,
        employeeCode: "EMP-103",
        name: "David Chen",
        email: userDavid.email,
        departmentId: "dept-1",
        designation: "Technical Product Manager",
        experienceYears: 5,
        joiningDate: "2023-06-10",
        status: "ACTIVE",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        performanceScore: 79,
        managerName: "Vikram Malhotra",
        projects: ["Roadmap 2026", "Enterprise SSO Rollout", "Analytics Dashboard"],
        achievements: ["Delivered Q2 Roadmap ahead of schedule"],
        certifications: ["Pragmatic Institute Certified (PMC-III)", "CSPO"],
        createdAt: "2023-06-10T00:00:00.000Z",
      },
      {
        id: "emp-4",
        userId: userRachel.id,
        employeeCode: "EMP-104",
        name: "Rachel Green",
        email: userRachel.email,
        departmentId: "dept-4",
        designation: "Senior Content & Brand Strategist",
        experienceYears: 4,
        joiningDate: "2023-10-01",
        status: "ACTIVE",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        performanceScore: 88,
        managerName: "Elena Rostova",
        projects: ["Q3 Rebrand Campaign", "Developer Tech Blog", "Podcast Series"],
        achievements: ["Grew organic web traffic by 120%"],
        certifications: ["HubSpot Inbound Certified", "Google Analytics 4 Certified"],
        createdAt: "2023-10-01T00:00:00.000Z",
      },
      {
        id: "emp-5",
        userId: userMarcus.id,
        employeeCode: "EMP-105",
        name: "Marcus Vance",
        email: userMarcus.email,
        departmentId: "dept-5",
        designation: "Enterprise Account Executive",
        experienceYears: 8,
        joiningDate: "2022-01-15",
        status: "ACTIVE",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        performanceScore: 94,
        managerName: "Jordan Belford",
        projects: ["Fortune 500 Strategic Accounts", "EMEA Expansion", "Partner Reseller Program"],
        achievements: ["140% Quota Attainment 2024", "President's Club Winner"],
        certifications: ["MEDDPIC Sales Certified"],
        createdAt: "2022-01-15T00:00:00.000Z",
      },
      {
        id: "emp-6",
        userId: userCarlos.id,
        employeeCode: "EMP-106",
        name: "Carlos Rodriguez",
        email: userCarlos.email,
        departmentId: "dept-7",
        designation: "Senior Support Escalation Lead",
        experienceYears: 5,
        joiningDate: "2023-01-20",
        status: "ACTIVE",
        avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        performanceScore: 81,
        managerName: "Nathalie Dupont",
        projects: ["Zendesk Automation", "Tier 3 Escalation Matrix", "Customer Help Center"],
        achievements: ["Maintained 98.2% CSAT over 6 months"],
        certifications: ["ITIL Foundation v4"],
        createdAt: "2023-01-20T00:00:00.000Z",
      },
      {
        id: "emp-7",
        userId: userSophia.id,
        employeeCode: "EMP-107",
        name: "Sophia Patel",
        email: userSophia.email,
        departmentId: "dept-3",
        designation: "Lead Financial Analyst",
        experienceYears: 5,
        joiningDate: "2023-05-15",
        status: "ACTIVE",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        performanceScore: 86,
        managerName: "Robert Sterling",
        projects: ["Budget Forecast Model 2026", "SaaS Metrics Unit Economics", "CapEx Optimization"],
        achievements: ["Automated Monthly Close down from 8 days to 2 days"],
        certifications: ["CFA Level II", "Financial Modeling & Valuation Analyst (FMVA)"],
        createdAt: "2023-05-15T00:00:00.000Z",
      },
      {
        id: "emp-sobhiya",
        userId: userSobhiya.id,
        employeeCode: "EMP-2005",
        name: "Sobhiya Logu",
        email: userSobhiya.email,
        departmentId: "dept-1",
        designation: "Staff Cloud Engineer",
        experienceYears: 5,
        joiningDate: "2023-01-10",
        status: "ACTIVE",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        performanceScore: 96,
        managerName: "Vikram Malhotra",
        projects: ["Enterprise AI Pipelines", "Cloud Microservices Reliability", "Gemini Realtime Engine"],
        achievements: ["Architected Enterprise AI Feedback Analyzer", "Q4 Top Innovator Award"],
        certifications: ["Google Cloud Professional Cloud Architect", "Certified Kubernetes Administrator (CKA)"],
        createdAt: "2023-01-10T00:00:00.000Z",
      },
    ];

    // 4. Feedbacks & Analyses
    const fb1: FeedbackRecord = {
      id: "fb-1",
      employeeId: "emp-1", // Alex
      departmentId: "dept-1",
      title: "Unsustainable workload and unrealistic sprint commitments",
      description: "I am working late every day and the project deadlines are too tight. We also don't have enough people in our team to handle the technical debt alongside new features.",
      category: "Workload",
      isAnonymous: false,
      status: "UNDER_REVIEW",
      createdAt: "2026-08-20T14:30:00.000Z",
      actionNotes: "HR meeting scheduled with Engineering Manager Vikram.",
    };

    const fa1: FeedbackAnalysisRecord = {
      id: "fa-1",
      feedbackId: "fb-1",
      sentiment: "NEGATIVE",
      category: "Workload",
      severity: "HIGH",
      issues: [
        "Excessive daily overtime and evening work",
        "Tight, unrealistic milestone deadlines",
        "Staffing shortage and team bandwidth deficit",
        "High accumulation of unaddressed technical debt"
      ],
      summary: "Employee reports severe workload strain due to compressed sprint timelines and inadequate team staffing capacity.",
      recommendations: [
        "Audit team capacity and redistribute current sprint deliverables",
        "Open requisition for 2 additional backend engineers",
        "Implement realistic sprint buffers for technical debt reduction"
      ],
      sentimentScore: -0.85,
      analyzedAt: "2026-08-20T14:30:15.000Z",
      isGeminiGenerated: true,
    };

    const fb2: FeedbackRecord = {
      id: "fb-2",
      employeeId: "emp-1", // Alex
      departmentId: "dept-1",
      title: "Weekend on-call burnout and lack of compensatory leave",
      description: "Another weekend on-call with multiple high-severity alerts. I feel completely exhausted, having zero recovery time before Monday sprint planning.",
      category: "Work-Life Balance",
      isAnonymous: false,
      status: "UNDER_REVIEW",
      createdAt: "2026-09-02T10:15:00.000Z",
      actionNotes: "Evaluating rotation schedule revisions.",
    };

    const fa2: FeedbackAnalysisRecord = {
      id: "fa-2",
      feedbackId: "fb-2",
      sentiment: "NEGATIVE",
      category: "Work-Life Balance",
      severity: "CRITICAL",
      issues: [
        "Repeated weekend emergency escalations",
        "High risk of acute employee burnout",
        "Lack of compensatory rest or on-call stipend",
        "Interference with personal well-being and health"
      ],
      summary: "Alex is experiencing critical burnout symptoms triggered by high-frequency weekend on-call rotations with insufficient recovery time.",
      recommendations: [
        "Implement mandatory compensatory off days following on-call duty",
        "Revise alert thresholds to reduce false-positive midnight pages",
        "Conduct immediate 1-on-1 wellness check-in with HR"
      ],
      sentimentScore: -0.92,
      analyzedAt: "2026-09-02T10:15:20.000Z",
      isGeminiGenerated: true,
    };

    const fb3: FeedbackRecord = {
      id: "fb-3",
      employeeId: "emp-2", // Priya
      departmentId: "dept-1",
      title: "Excellent cloud tooling upgrades and CI/CD enhancements",
      description: "The new cloud development environment and CI/CD pipelines have cut build times by half. Developer experience has improved significantly!",
      category: "Technology",
      isAnonymous: false,
      status: "RESOLVED",
      createdAt: "2026-08-25T11:00:00.000Z",
      actionNotes: "Shared positive feedback with Platform Infrastructure team.",
    };

    const fa3: FeedbackAnalysisRecord = {
      id: "fa-3",
      feedbackId: "fb-3",
      sentiment: "POSITIVE",
      category: "Technology",
      severity: "LOW",
      issues: [
        "High satisfaction with DevOps infrastructure",
        "Productivity gains from 50% faster build pipelines"
      ],
      summary: "Employee expressed strong satisfaction with recent DevOps toolchain modernizations and build speed improvements.",
      recommendations: [
        "Recognize DevOps team contributions during company town hall",
        "Document tooling migration case study for engineering handbook"
      ],
      sentimentScore: 0.9,
      analyzedAt: "2026-08-25T11:00:10.000Z",
      isGeminiGenerated: true,
    };

    const fb4: FeedbackRecord = {
      id: "fb-4",
      employeeId: "emp-6", // Carlos
      departmentId: "dept-7",
      title: "Cafeteria facilities and seating capacity during lunch rush",
      description: "Poor cafeteria facilities. Seating is heavily congested during peak lunch hours and dietary options like vegetarian or clean meal choices are very limited.",
      category: "Workplace Facilities",
      isAnonymous: false,
      status: "ACTION_TAKEN",
      createdAt: "2026-08-28T13:45:00.000Z",
      actionNotes: "Operations engaged catering vendor to expand menu options and stagger break times.",
    };

    const fa4: FeedbackAnalysisRecord = {
      id: "fa-4",
      feedbackId: "fb-4",
      sentiment: "NEGATIVE",
      category: "Workplace Facilities",
      severity: "MEDIUM",
      issues: [
        "Insufficient cafeteria dining seating capacity",
        "Lack of healthy, dietary-friendly food variety",
        "Congestion during midday hours"
      ],
      summary: "Support staff flagged cafeteria overcrowding and inadequate healthy/vegetarian meal selections.",
      recommendations: [
        "Improve cafeteria seating, cleanliness and diverse food options",
        "Stagger department lunch breaks to reduce peak congestion",
        "Send employee survey for dietary preferences"
      ],
      sentimentScore: -0.6,
      analyzedAt: "2026-08-28T13:45:15.000Z",
      isGeminiGenerated: true,
    };

    const fb5: FeedbackRecord = {
      id: "fb-5",
      employeeId: "emp-3", // David
      departmentId: "dept-1",
      title: "Need for transparent compensation benchmarking and review bands",
      description: "Annual salary appraisals feel arbitrary. Market compensation rates have surged across peer companies, but internal review criteria remain opaque.",
      category: "Salary & Benefits",
      isAnonymous: false,
      status: "UNDER_REVIEW",
      createdAt: "2026-09-05T16:20:00.000Z",
    };

    const fa5: FeedbackAnalysisRecord = {
      id: "fa-5",
      feedbackId: "fb-5",
      sentiment: "NEGATIVE",
      category: "Salary & Benefits",
      severity: "HIGH",
      issues: [
        "Opaque salary appraisal criteria",
        "Perceived compensation lag relative to external market benchmarks",
        "Retention risk among mid-to-senior product leads"
      ],
      summary: "Employee expressed dissatisfaction with compensation clarity and requested updated market salary band adjustments.",
      recommendations: [
        "Conduct external compensation benchmarking survey",
        "Publish transparent level-based salary bands and promotion rubrics",
        "Conduct mid-year retention compensation adjustments"
      ],
      sentimentScore: -0.75,
      analyzedAt: "2026-09-05T16:20:12.000Z",
      isGeminiGenerated: true,
    };

    const fb6: FeedbackRecord = {
      id: "fb-6",
      employeeId: "emp-4", // Rachel
      departmentId: "dept-4",
      title: "Great team synergy in Q3 campaign execution",
      description: "Cross-functional collaboration between marketing, product, and design was seamless. Clear leadership direction made the product launch a major success.",
      category: "Team Collaboration",
      isAnonymous: false,
      status: "RESOLVED",
      createdAt: "2026-09-08T09:30:00.000Z",
    };

    const fa6: FeedbackAnalysisRecord = {
      id: "fa-6",
      feedbackId: "fb-6",
      sentiment: "POSITIVE",
      category: "Team Collaboration",
      severity: "LOW",
      issues: [
        "Strong inter-departmental trust and alignment",
        "Effective strategic leadership communication"
      ],
      summary: "Marketing specialist praised seamless cross-functional alignment and clear leadership guidance during product launch.",
      recommendations: [
        "Document collaboration playbook as best practice template",
        "Celebrate cross-team milestone in upcoming company newsletter"
      ],
      sentimentScore: 0.88,
      analyzedAt: "2026-09-08T09:30:10.000Z",
      isGeminiGenerated: true,
    };

    const fb7: FeedbackRecord = {
      id: "fb-7",
      employeeId: "emp-7", // Sophia
      departmentId: "dept-3",
      title: "Lack of structured career development and promotion pathways",
      description: "I feel stagnated in my current role. There are no clear milestones for moving from analyst to manager, and training budgets are not readily accessible.",
      category: "Career Growth",
      isAnonymous: false,
      status: "PENDING",
      createdAt: "2026-09-09T15:00:00.000Z",
    };

    const fa7: FeedbackAnalysisRecord = {
      id: "fa-7",
      feedbackId: "fb-7",
      sentiment: "NEGATIVE",
      category: "Career Growth",
      severity: "MEDIUM",
      issues: [
        "Stagnant career progression trajectory",
        "Ambiguous promotional criteria",
        "Underutilized professional development budget"
      ],
      summary: "Financial analyst voiced concerns regarding unclear career advancement pathways and professional training sponsorship.",
      recommendations: [
        "Introduce structured career development plans and internal mobility",
        "Establish annual learning stipend ($1,500/employee) with self-service approval",
        "Schedule bi-annual career roadmap discussions between leads and staff"
      ],
      sentimentScore: -0.65,
      analyzedAt: "2026-09-09T15:00:15.000Z",
      isGeminiGenerated: true,
    };

    const fb8: FeedbackRecord = {
      id: "fb-8",
      employeeId: "emp-5", // Marcus
      departmentId: "dept-5",
      title: "Competitive commission tiers and positive sales incentives",
      description: "The revised sales incentive program introduced last quarter is transparent, fair, and motivating. The team is energized.",
      category: "Salary & Benefits",
      isAnonymous: false,
      status: "RESOLVED",
      createdAt: "2026-09-10T11:20:00.000Z",
    };

    const fa8: FeedbackAnalysisRecord = {
      id: "fa-8",
      feedbackId: "fb-8",
      sentiment: "POSITIVE",
      category: "Salary & Benefits",
      severity: "LOW",
      issues: [
        "Effective sales commission alignment",
        "High motivation across enterprise sales team"
      ],
      summary: "Sales executive validated the fairness and motivational impact of the newly updated compensation structure.",
      recommendations: [
        "Maintain current commission tier structure through fiscal year end",
        "Share compensation design framework with other revenue departments"
      ],
      sentimentScore: 0.95,
      analyzedAt: "2026-09-10T11:20:10.000Z",
      isGeminiGenerated: true,
    };

    const fb9: FeedbackRecord = {
      id: "fb-9",
      employeeId: "emp-sobhiya",
      departmentId: "dept-1",
      title: "Streamlined AI Pipeline and Real-time Gemini Automation",
      description: "Integrating Gemini 3.8 models directly into our core employee feedback loop has saved hours of manual analysis every week. The instant categorization and sentiment extraction works seamlessly.",
      category: "Technology",
      isAnonymous: false,
      status: "RESOLVED",
      createdAt: "2026-09-12T09:30:00.000Z",
      actionNotes: "Acknowledged by Engineering Lead and HR Operations.",
    };

    const fa9: FeedbackAnalysisRecord = {
      id: "fa-9",
      feedbackId: "fb-9",
      sentiment: "POSITIVE",
      category: "Technology",
      severity: "LOW",
      issues: [
        "Positive sentiment on Gemini AI automation",
        "High productivity gain in feedback processing"
      ],
      summary: "Staff Engineer Sobhiya Logu highlighted immense time savings and automated efficiency from the AI feedback analysis pipeline.",
      recommendations: [
        "Continue expanding Gemini automation into proactive sentiment drift detection",
        "Publish internal tech brief on AI system architecture"
      ],
      sentimentScore: 0.98,
      analyzedAt: "2026-09-12T09:30:15.000Z",
      isGeminiGenerated: true,
    };

    this.feedbacks = [fb1, fb2, fb3, fb4, fb5, fb6, fb7, fb8, fb9];
    this.feedbackAnalyses = [fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9];

    // 5. Goals
    this.goals = [
      {
        id: "goal-sobhiya-1",
        employeeId: "emp-sobhiya",
        title: "Scale Real-time AI Sentiment Analyzer to 99.9% Uptime",
        description: "Optimize serverless inference latency and add resilient fallback caches for peak appraisal cycles.",
        targetDate: "2026-11-30",
        status: "IN_PROGRESS",
        progress: 88,
        createdAt: "2026-08-10T00:00:00.000Z",
      },
      {
        id: "goal-1",
        employeeId: "emp-1",
        title: "Migrate Payment Microservice to Kubernetes",
        description: "Complete zero-downtime cluster migration and implement automated canary deployments.",
        targetDate: "2026-10-31",
        status: "IN_PROGRESS",
        progress: 75,
        createdAt: "2026-07-01T00:00:00.000Z",
      },
      {
        id: "goal-2",
        employeeId: "emp-1",
        title: "Reduce Sprint Backlog Tech Debt by 30%",
        description: "Refactor legacy database connection pool and optimize slow SQL queries.",
        targetDate: "2026-11-15",
        status: "IN_PROGRESS",
        progress: 40,
        createdAt: "2026-08-01T00:00:00.000Z",
      },
      {
        id: "goal-3",
        employeeId: "emp-2",
        title: "Publish Enterprise Design System v2.0",
        description: "Deliver accessible React component library with WCAG AAA compliance.",
        targetDate: "2026-09-30",
        status: "COMPLETED",
        progress: 100,
        createdAt: "2026-06-01T00:00:00.000Z",
      },
      {
        id: "goal-4",
        employeeId: "emp-7",
        title: "Automate Monthly Board Financial Dashboard",
        description: "Build live executive financial reporting dashboard in Looker/PowerBI.",
        targetDate: "2026-10-15",
        status: "IN_PROGRESS",
        progress: 60,
        createdAt: "2026-08-15T00:00:00.000Z",
      },
    ];

    // 6. Recalculate employee risks
    this.recalculateAllEmployeeRisks();

    // 7. Seed Notifications
    this.notifications = [
      {
        id: "notif-1",
        title: "Critical Employee Risk Alert",
        message: "Alex Morgan (Engineering) has logged repeated negative feedback with severe burnout and on-call exhaustion markers.",
        type: "CRITICAL",
        targetRole: "HR_ADMIN",
        departmentId: "dept-1",
        isRead: false,
        createdAt: "2026-09-02T10:16:00.000Z",
      },
      {
        id: "notif-2",
        title: "Multiple Negative Feedback in Engineering",
        message: "3 negative feedback submissions received from Engineering regarding workload pressure and compensation within the last 30 days.",
        type: "WARNING",
        targetRole: "HR_ADMIN",
        departmentId: "dept-1",
        isRead: false,
        createdAt: "2026-09-05T16:25:00.000Z",
      },
      {
        id: "notif-3",
        title: "New AI Organizational Insight Available",
        message: "Gemini AI detected an emerging pattern: Cafeteria seating and meal variety are driving dissatisfaction among Operations & Support teams.",
        type: "INFO",
        targetRole: "HR_ADMIN",
        departmentId: "dept-7",
        isRead: false,
        createdAt: "2026-08-28T14:00:00.000Z",
      },
      {
        id: "notif-4",
        title: "High Performance Recognition",
        message: "Priya Sharma achieved 92 performance rating and positive peer feedback on technology upgrades.",
        type: "SUCCESS",
        targetRole: "HR_ADMIN",
        departmentId: "dept-1",
        isRead: true,
        createdAt: "2026-08-26T09:00:00.000Z",
      },
    ];
  }

  // Real database calculation: compute risk dynamically from feedback records
  calculateEmployeeRisk(employeeId: string): EmployeeRiskRecord {
    const employee = this.employees.find((e) => e.id === employeeId);
    const empFeedbacks = this.feedbacks.filter((f) => f.employeeId === employeeId);
    const analyses = empFeedbacks
      .map((f) => this.feedbackAnalyses.find((a) => a.feedbackId === f.id))
      .filter((a): a is FeedbackAnalysisRecord => a !== undefined);

    let negCount = 0;
    let criticalCount = 0;
    let highCount = 0;
    let workloadBurnoutIssues = 0;
    const issuesSet = new Set<string>();

    analyses.forEach((a) => {
      if (a.sentiment === "NEGATIVE") negCount++;
      if (a.severity === "CRITICAL") criticalCount++;
      if (a.severity === "HIGH") highCount++;
      a.issues.forEach((i) => {
        issuesSet.add(i);
        const lower = i.toLowerCase();
        if (
          lower.includes("burnout") ||
          lower.includes("exhaust") ||
          lower.includes("overtime") ||
          lower.includes("workload") ||
          lower.includes("deadline")
        ) {
          workloadBurnoutIssues++;
        }
      });
    });

    let riskLevel: RiskLevel = "LOW";
    let riskScore = 15; // baseline healthy score
    let burnoutRisk = false;

    if (criticalCount > 0 || (negCount >= 2 && workloadBurnoutIssues >= 2)) {
      riskLevel = "CRITICAL";
      riskScore = 85 + Math.min(15, negCount * 3);
      burnoutRisk = true;
    } else if (highCount > 0 || negCount >= 2) {
      riskLevel = "HIGH";
      riskScore = 65 + Math.min(15, negCount * 4);
      burnoutRisk = workloadBurnoutIssues > 0;
    } else if (negCount === 1 || highCount > 0) {
      riskLevel = "MEDIUM";
      riskScore = 42;
    }

    const recommendations: string[] = [];
    if (burnoutRisk) {
      recommendations.push("Schedule an immediate 1-on-1 confidential check-in regarding workload and wellness");
      recommendations.push("Implement mandatory on-call rotation pause and compensatory time off");
      recommendations.push("Rebalance project delivery commitments with direct manager");
    } else if (riskLevel === "HIGH") {
      recommendations.push("Address core blockers raised in recent submissions");
      recommendations.push("Review compensation and career path progression milestones");
    } else {
      recommendations.push("Maintain regular quarterly 1-on-1 check-ins");
      recommendations.push("Recognize recent accomplishments and maintain supportive environment");
    }

    const record: EmployeeRiskRecord = {
      id: `risk-${employeeId}`,
      employeeId,
      riskLevel,
      riskScore,
      burnoutRisk,
      dominantIssues: Array.from(issuesSet).slice(0, 4),
      lastCalculatedAt: new Date().toISOString(),
      recommendations,
    };

    return record;
  }

  recalculateAllEmployeeRisks() {
    this.employeeRisks = this.employees.map((e) => this.calculateEmployeeRisk(e.id));
  }
}

export const db = new Database();
