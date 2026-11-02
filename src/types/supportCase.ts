export type CaseStatus = "open" | "in-progress" | "closed";

export type CasePriority = "low" | "medium" | "high" | "critical";

export type CaseCategory = "billing" | "technical" | "account";

export type CustomerTier = "free" | "standard" | "premium";

export interface SupportAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: CaseCategory;
}

export interface SupportCase {
  id: string;
  customer: string;
  customerEmail: string;
  customerTier: CustomerTier;
  subject: string;
  status: CaseStatus;
  priority: CasePriority;
  agentId: string | null;
  category: CaseCategory;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deadline: Date;
}
