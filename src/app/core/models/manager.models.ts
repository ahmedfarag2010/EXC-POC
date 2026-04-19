import type { UpdateHistoryItem, RequestServiceDetails } from './request.models';

/**
 * Manager Models
 */

export interface ManagerDecisionDto {
  taskId: string; // UUID
  isApproved: boolean;
}

export interface ManagerTask {
  id: string;
  requestId: string;
  employee?: string;
  serviceType?: string;
  createdAt?: string;
  lastUpdated?: string;
  status: number;
  serviceDetails?: RequestServiceDetails;
  updateHistory?: UpdateHistoryItem[];
}
