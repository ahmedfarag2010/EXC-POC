/**
 * Request Models
 */

export enum VisaType {
  Single = 1,
  Multiple = 2
}

export enum VisaRequestType {
  SingleVisa = 1,
  FamilyVisa = 2
}

export enum Duration {
  OneMonth = 1,
  TwoMonths = 2,
  ThreeMonths = 3,
  FourMonths = 4,
  FiveMonths = 5
}

export enum RequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3
}

export interface CreateRequestDto {
  iqamaNumber: string;
  visaType: VisaType;
  duration: Duration;
  type: VisaRequestType;
  visaFees: boolean;
  justification?: string | null;
}

export interface Request {
  id: string;
  requestNumber?: string;
  employee?: string;
  serviceType?: string;
  submissionDate?: string;
  lastUpdated?: string;
  status: RequestStatus;
  serviceDetails?: RequestServiceDetails;
  updateHistory?: UpdateHistoryItem[];
}

export interface RequestServiceDetails {
  iqamaNumber: string;
  duration: Duration;
  visaType: VisaType;
  type: VisaRequestType;
  visaFees: boolean;
  justification?: string;
}

export interface UpdateHistoryItem {
  date: string;
  action: string;
  actor: string;
}
