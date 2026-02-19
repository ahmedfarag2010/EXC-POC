import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { LookupData } from '../models/lookup.models';

@Injectable({
  providedIn: 'root'
})
export class LookupsService {
  private http = inject(HttpClient);

  /**
   * Get all lookup data
   */
  getLookups(): Observable<LookupData> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.lookups}`;
    console.log('📋 [LOOKUPS SERVICE] Fetching lookups from:', url);
    return this.http.get<LookupData>(url);
  }
}
