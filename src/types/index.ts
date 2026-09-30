export type UserRole = 'ADMIN' | 'REVIEWER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DocumentStatus =
  | 'UPLOADED'
  | 'QUEUED'
  | 'PROCESSING'
  | 'OCR_COMPLETED'
  | 'CLASSIFIED'
  | 'EXTRACTED'
  | 'VALIDATED'
  | 'REVIEW_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PROCESSING_FAILED'
  | 'ARCHIVED';

export type DocumentType =
  | 'INVOICE'
  | 'PURCHASE_ORDER'
  | 'RECEIPT'
  | 'DELIVERY_NOTE'
  | 'CREDIT_NOTE'
  | 'OTHER';

export type DocumentQualityScore = 'GOOD' | 'FAIR' | 'POOR' | 'UNREADABLE';

export type DecisionStatus = 'AUTO_APPROVE' | 'REVIEW_REQUIRED' | 'REJECT';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedField {
  id?: string;
  fieldName: string;
  value: string | number | null;
  confidence: number;
  pageNumber: number;
  sourceText?: string;
  boundingBox?: BoundingBox;
  isValid: boolean;
  isHumanCorrected?: boolean;
  originalAiValue?: string | number | null;
  extractionMethod?: string;
}

export interface LineItem {
  id?: string;
  lineNumber: number;
  itemName: string;
  skuCode?: string;
  hsnSac?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountAmount?: number;
  taxRate?: number;
  taxAmount?: number;
  lineTotal: number;
  confidence: number;
  boundingBox?: BoundingBox;
  pageNumber?: number;
}

export type IssueSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export interface ValidationIssue {
  id: string;
  fieldName?: string;
  issueCode: string;
  severity: IssueSeverity;
  message: string;
  suggestedFix?: string;
  metadata?: Record<string, any>;
  isResolved?: boolean;
}

export interface ValidationResult {
  id?: string;
  documentId?: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  rulePassCount: number;
  ruleWarningCount: number;
  ruleFailureCount: number;
  issues: ValidationIssue[];
  executedAt: string;
}

export interface ExtractionVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  createdByUserId?: string;
  changeType: 'AI_INITIAL' | 'HUMAN_CORRECTION' | 'REPROCESSED';
  summary?: string;
  dataSnapshot: {
    fields: ExtractedField[];
    lineItems: LineItem[];
    domainData?: any;
  };
  createdAt: string;
}

export interface DocumentComment {
  id: string;
  userId: string;
  userFullName: string;
  text: string;
  fieldAnchor?: string;
  createdAt: string;
}

export interface DocumentEntity {
  id: string;
  userId: string;
  title: string;
  originalFilename: string;
  fileSizeBytes: number;
  mimeType: string;
  storagePath: string;
  documentHash: string;
  status: DocumentStatus;
  qualityScore: DocumentQualityScore;
  documentType?: DocumentType;
  classificationConfidence?: number;
  overallConfidence?: number;
  decision?: DecisionStatus;
  decisionReason?: string;
  supplierId?: string;
  supplierName?: string;
  referenceNumber?: string;
  documentDate?: string;
  dueDate?: string;
  currency: string;
  totalAmount?: number;
  pageCount: number;
  isExactDuplicate?: boolean;
  duplicateOfId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  taxIdentifier?: string;
  email?: string;
  phone?: string;
  address?: string;
  currency: string;
  riskScore: number;
  totalSpend: number;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Insight {
  id: string;
  documentId?: string;
  supplierId?: string;
  insightType:
    | 'POTENTIAL_DUPLICATE'
    | 'PO_MISMATCH'
    | 'LOW_CONFIDENCE'
    | 'TAX_ANOMALY'
    | 'UNUSUAL_AMOUNT'
    | 'SPEND_CONCENTRATION'
    | 'UPCOMING_DUE_DATE'
    | 'SUPPLIER_RISK';
  severity: IssueSeverity;
  title: string;
  explanation: string;
  evidence: Record<string, any>;
  isDismissed: boolean;
  createdAt: string;
}

export interface DashboardMetrics {
  kpis: {
    totalDocuments: number;
    approvedDocuments: number;
    pendingReviewDocuments: number;
    rejectedDocuments: number;
    failedDocuments: number;
    totalInvoiceSpend: number;
    duplicateCount: number;
    poMismatchCount: number;
    taxAnomalyCount: number;
  };
  trustHealth: {
    averageConfidence: number;
    humanCorrectionRate: number;
    autoApprovalRate: number;
    validationPassRate: number;
    averageProcessingTimeMs: number;
  };
  charts: {
    documentsByType: Array<{ name: string; value: number }>;
    documentsByStatus: Array<{ name: string; value: number }>;
    supplierSpend: Array<{ name: string; fullName: string; spend: number; documents: number; riskScore: number }>;
    spendTrends: Array<{ date: string; amount: number }>;
  };
}

export interface DemoScenario {
  id: string;
  title: string;
  filename: string;
  documentType: string;
  description: string;
  expectedOutcome: 'AUTO_APPROVE' | 'REVIEW_REQUIRED' | 'REJECT';
  keyDifferentiator: string;
}

export interface AssistantSource {
  documentId: string;
  documentTitle: string;
  documentType?: string;
  page?: number;
  relevantSnippet?: string;
  excerpt?: string;
  confidence?: number;
}

export interface AssistantResponse {
  answer: string;
  sources: AssistantSource[];
  suggestedFollowUps?: string[];
  executionTimeMs?: number;
}
