import type { UpdateHistoryItem, RequestServiceDetails } from './request.models';

/**
 * Manager Models
 */

export interface ManagerDecisionDto {
  requestId: string; // UUID
  isApproved: boolean;
}

export interface ManagerTask {
  id: string;
  requestId: string;
  employee?: string;
  serviceType?: string;
  submissionDate?: string;
  lastUpdated?: string;
  status: number;
  serviceDetails?: RequestServiceDetails;
  updateHistory?: UpdateHistoryItem[];
}
