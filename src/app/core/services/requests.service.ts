import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { CreateRequestDto, Request, RequestStatus } from '../models/request.models';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private http = inject(HttpClient);

  /**
   * Create a new request
   */
  createRequest(request: CreateRequestDto): Observable<any> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.requests.create}`;
    console.log('📝 [REQUESTS SERVICE] Creating request:', request);
    return this.http.post(url, request);
  }

  /**
   * Get user's requests
   * @param status Optional status filter
   */
  getMyRequests(status?: RequestStatus): Observable<Request[]> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.requests.my}`;
    let params = new HttpParams();
    
    if (status !== undefined) {
      params = params.set('status', status.toString());
    }

    console.log('📋 [REQUESTS SERVICE] Fetching my requests:', { status, url });
    return this.http.get<Request[]>(url, { params });
  }

  /**
   * Get request by ID
   * Note: This endpoint might not exist in the API, but we'll prepare for it
   */
  getRequestById(requestId: string): Observable<Request> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.requests.my}/${requestId}`;
    console.log('🔍 [REQUESTS SERVICE] Fetching request:', requestId);
    return this.http.get<Request>(url);
  }
}
