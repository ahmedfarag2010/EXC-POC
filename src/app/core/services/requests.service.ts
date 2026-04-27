import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { CreateRequestDto, Request, RequestStatus } from '../models/request.models';

/** Set true to skip POST and only log payload (for debugging) */
const HOLD_REQUESTS_CREATE = false;

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private http = inject(HttpClient);

  private normalizeRequest(request: any): Request {
    return {
      ...request,
      requestOrder: request.requestOrder ?? request.RequestOrder,
      employee: request.createdBy ?? request.employee,
      serviceType: request.ServiceName ?? request.serviceName ?? request.serviceType,
      status: request.status,
      serviceDetails: request.serviceDetails ?? {
        iqamaNumber: request.iqamaNumber,
        duration: request.duration,
        visaType: request.visaType,
        type: request.type,
        visaFees: request.visaFees,
        justification: request.justification
      }
    } as Request;
  }

  /**
   * Create a new request (e.g. static visa form). Body: `{ serviceId, JsonData }` where
   * `JsonData` is a JSON string of the form DTO.
   */
  createRequest(serviceId: string, request: CreateRequestDto): Observable<unknown> {
    const body = { serviceId, JsonData: JSON.stringify(request) };
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.requests.create}`;
    if (HOLD_REQUESTS_CREATE) {
      console.log('[REQUESTS SERVICE] HOLD: POST not sent. URL would be:', url);
      console.log('[REQUESTS SERVICE] HOLD: payload:', body);
      return of({ held: true, message: 'POST /api/requests skipped (HOLD_REQUESTS_CREATE)' });
    }
    return this.http.post<unknown>(url, body);
  }

  /**
   * Submit a dynamic service request. Body: `{ serviceId, JsonData }` where
   * `JsonData` is a JSON string of the controls array (each item includes `value`).
   */
  createServiceRequest(body: { serviceId: string; JsonData: string }): Observable<unknown> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.requests.create}`;
    if (HOLD_REQUESTS_CREATE) {
      console.log('[REQUESTS SERVICE] HOLD: POST not sent. URL would be:', url);
      console.log('[REQUESTS SERVICE] HOLD: payload:', body);
      return of({ held: true, message: 'POST /api/requests skipped (HOLD_REQUESTS_CREATE)' });
    }
    return this.http.post<unknown>(url, body);
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
    return this.http.get<any[]>(url, { params }).pipe(
      map((requests) => requests.map((request) => this.normalizeRequest(request)))
    );
  }
}
