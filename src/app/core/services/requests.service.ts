import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { CreateRequestDto, Request, RequestStatus } from '../models/request.models';

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
    return this.http.get<any[]>(url, { params }).pipe(
      map((requests) => requests.map((request) => this.normalizeRequest(request)))
    );
  }
}
