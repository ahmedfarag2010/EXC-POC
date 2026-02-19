/**
 * Lookup Models
 */

export interface LookupData {
  categories?: LookupCategory[];
  serviceTypes?: ServiceType[];
  [key: string]: any;
}

export interface LookupCategory {
  id: number;
  name: string;
  icon?: string;
}

export interface ServiceType {
  id: number;
  name: string;
  description?: string;
  categoryId?: number;
}
