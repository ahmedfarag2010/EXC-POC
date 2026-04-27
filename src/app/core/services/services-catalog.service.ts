import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, type Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  ServiceDetail,
  ServiceFieldControl,
  ServiceFieldType,
  ServiceSummary
} from '../models/service.models';

@Injectable({
  providedIn: 'root'
})
export class ServicesCatalogService {
  private http = inject(HttpClient);

  getServices(): Observable<ServiceSummary[]> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.services.list}`;
    return this.http
      .get<unknown>(url)
      .pipe(map((raw) => this.normalizeList(raw)));
  }

  getServiceById(id: string | number): Observable<ServiceDetail> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.services.list}/${id}`;
    return this.http
      .get<unknown>(url)
      .pipe(map((raw) => this.normalizeDetail(raw, id)));
  }

  private normalizeList(raw: unknown): ServiceSummary[] {
    if (Array.isArray(raw)) {
      return raw.map((item) => this.normalizeServiceSummary(item));
    }
    if (raw && typeof raw === 'object') {
      const o = raw as Record<string, unknown>;
      const arr = o['data'] ?? o['Data'] ?? o['services'] ?? o['Services'] ?? o['items'] ?? o['Items'];
      if (Array.isArray(arr)) {
        return arr.map((item) => this.normalizeServiceSummary(item));
      }
    }
    return [];
  }

  private normalizeServiceSummary(item: unknown): ServiceSummary {
    const o = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    return {
      id: (o['id'] ?? o['Id'] ?? '') as string | number,
      name: String(o['name'] ?? o['Name'] ?? ''),
      description: (o['description'] ?? o['Description']) as string | undefined,
      category: (o['category'] ?? o['CategoryName'] ?? o['categoryName']) as string | undefined
    };
  }

  private normalizeDetail(raw: unknown, fallbackId: string | number): ServiceDetail {
    const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const controlsRaw = o['controls'] ?? o['Controls'] ?? o['fields'] ?? o['Fields'] ?? o['Items'] ?? [];
    const list = this.parseControlsToArray(controlsRaw);

    return {
      id: (o['id'] ?? o['Id'] ?? fallbackId) as string | number,
      name: String(o['name'] ?? o['Name'] ?? ''),
      description: (o['description'] ?? o['Description']) as string | undefined,
      category: (o['category'] ?? o['CategoryName']) as string | undefined,
      controls: list.map((c) => this.normalizeFieldControl(c)),
      controlsJsonTemplate: this.cloneControlDefinitions(list)
    };
  }

  private cloneControlDefinitions(list: unknown[]): unknown[] {
    try {
      return JSON.parse(JSON.stringify(list)) as unknown[];
    } catch {
      return [];
    }
  }

  /**
   * API may return `controls` as a JSON string; parse it for use as an array of field definitions.
   * After parsing, string values like `"[]"` / `"{}"` (or any JSON in a string) are coerced to real
   * arrays/objects so `value: "[]"` becomes `value: []`.
   * Parsed and normalized value is also logged to the console for debugging.
   */
  private parseControlsToArray(controlsRaw: unknown): unknown[] {
    if (Array.isArray(controlsRaw)) {
      const out = controlsRaw.map((c) => this.deepNormalizeStringifiedJsonFields(c));
      console.log('[ServicesCatalog] Parsed service controls (array)', out);
      return out;
    }
    if (typeof controlsRaw === 'string' && controlsRaw.trim() !== '') {
      try {
        const parsed: unknown = JSON.parse(controlsRaw);
        if (Array.isArray(parsed)) {
          const out = parsed.map((c) => this.deepNormalizeStringifiedJsonFields(c));
          console.log('[ServicesCatalog] Parsed service controls (from JSON string)', out);
          return out;
        }
        if (parsed && typeof parsed === 'object') {
          const out = this.deepNormalizeStringifiedJsonFields(parsed);
          console.log('[ServicesCatalog] Parsed service controls (from JSON string)', [out]);
          return [out];
        }
        return [];
      } catch (e) {
        console.error('[ServicesCatalog] Failed to parse controls JSON string', e, controlsRaw);
        return [];
      }
    }
    return [];
  }

  /**
   * Turns embedded JSON strings into real values (e.g. `value: "[]"` -> `value: []`).
   * Recurses into arrays and plain objects.
   */
  private deepNormalizeStringifiedJsonFields(v: unknown): unknown {
    if (v === null || v === undefined) {
      return v;
    }
    if (typeof v === 'string') {
      const t = v.trim();
      if (t === '[]') {
        return [];
      }
      if (t === '{}') {
        return {};
      }
      if (t.length >= 2 && (t.startsWith('[') || t.startsWith('{'))) {
        try {
          return this.deepNormalizeStringifiedJsonFields(JSON.parse(t) as unknown);
        } catch {
          return v;
        }
      }
      return v;
    }
    if (Array.isArray(v)) {
      return v.map((x) => this.deepNormalizeStringifiedJsonFields(x));
    }
    if (typeof v === 'object') {
      const o = v as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o)) {
        out[k] = this.deepNormalizeStringifiedJsonFields(o[k]);
      }
      return out;
    }
    return v;
  }

  private normalizeFieldControl(item: unknown): ServiceFieldControl {
    const c = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const name = String(
      c['formControlName'] ??
        c['FormControlName'] ??
        c['name'] ??
        c['Name'] ??
        c['fieldName'] ??
        c['Key'] ??
        c['key'] ??
        c['field'] ??
        'field'
    );
    const label = String(c['label'] ?? c['Label'] ?? c['title'] ?? c['Title'] ?? name);
    const type = this.mapFieldType(
      c['type'] ?? c['Type'] ?? c['controlType'] ?? c['ControlType'] ?? c['DataType'] ?? c['dataType']
    );
    const required = Boolean(
      c['required'] ?? c['Required'] ?? c['isRequired'] ?? c['IsRequired'] ?? false
    );
    const placeholder = (c['placeholder'] ?? c['Placeholder']) as string | undefined;
    const options = this.normalizeOptions(
      c['options'] ?? c['Options'] ?? c['values'] ?? c['Values'] ?? c['selectOptions']
    );
    return { name, label, type, required, placeholder, options };
  }

  private mapFieldType(v: unknown): ServiceFieldType {
    const s = String(v ?? 'text')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '');
    const map: Record<string, ServiceFieldType> = {
      text: 'text',
      string: 'text',
      number: 'number',
      int: 'number',
      integer: 'number',
      select: 'select',
      dropdown: 'select',
      combobox: 'select',
      list: 'select',
      textarea: 'textarea',
      multilinetext: 'textarea',
      longtext: 'textarea',
      radio: 'radio',
      radiobutton: 'radio',
      radiogroup: 'radio',
      boolean: 'boolean',
      bool: 'boolean',
      checkbox: 'checkbox',
      checkboxes: 'checkbox',
      multiselect: 'checkbox',
      date: 'date',
      datetime: 'date',
      daterange: 'dateRange',
      daterangepicker: 'dateRange',
      range: 'dateRange',
      file: 'file',
      fileupload: 'file',
      upload: 'file',
      attachment: 'file'
    };
    return map[s] ?? 'text';
  }

  private normalizeOptions(raw: unknown): { value: string | number; label: string }[] {
    if (typeof raw === 'string' && raw.trim() === '[]') {
      return [];
    }
    if (!Array.isArray(raw) || raw.length === 0) {
      return [];
    }
    return raw.map((o) => {
      if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean') {
        const v = o as string | number;
        return { value: v, label: String(v) };
      }
      if (o && typeof o === 'object') {
        const x = o as Record<string, unknown>;
        const value = (x['value'] ?? x['Value'] ?? x['id'] ?? x['Id'] ?? x['key'] ?? 0) as
          | string
          | number;
        const label = String(x['label'] ?? x['Label'] ?? x['name'] ?? x['Name'] ?? value);
        return { value, label };
      }
      return { value: '', label: '' };
    });
  }
}
