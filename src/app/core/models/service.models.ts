/**
 * Public services catalog and dynamic form controls from the API
 */

/**
 * Dynamic service form control types (aligned with API + form-builder catalog).
 * - `dateRange` uses `name + '_start'` and `name + '_end'` form control names.
 * - `checkbox` stores an array of selected option values.
 * - `file` stores a `File` in the form (serialized to base64 on submit).
 */
export type ServiceFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'dateRange'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'boolean';

export interface ServiceSummary {
  id: string | number;
  name: string;
  description?: string;
  category?: string;
}

export interface ServiceFieldControl {
  name: string;
  label: string;
  type: ServiceFieldType;
  required: boolean;
  placeholder?: string;
  options: { value: string | number; label: string }[];
}

export interface ServiceDetail {
  id: string | number;
  name: string;
  description?: string;
  category?: string;
  controls: ServiceFieldControl[];
  /**
   * Deep copy of the parsed `controls` array from the API (order + extra keys preserved)
   * so submitted `JsonData` can stringify the same structure with `value` filled in.
   */
  controlsJsonTemplate: unknown[];
}
