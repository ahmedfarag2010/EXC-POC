import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ManagerDecisionDto, ManagerTask } from '../models/manager.models';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private http = inject(HttpClient);

  /**
   * Get manager tasks
   */
  getManagerTasks(): Observable<ManagerTask[]> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.manager.tasks}`;
    console.log('📋 [MANAGER SERVICE] Fetching manager tasks from:', url);
    return this.http.get<any[]>(url).pipe(
      map((records) =>
        records.map((record) => {
          const firstTask = record.tasks?.[0];
          const serviceDetails = record.serviceDetails ?? {
            iqamaNumber: record.iqamaNumber,
            visaType: record.visaType,
            duration: record.duration,
            type: record.type,
            visaFees: record.visaFees,
            justification: record.justification
          };
          return {
            ...record,
            taskId: record.taskId ?? firstTask?.taskId,
            requestOrder: record.requestOrder ?? record.RequestOrder,
            employee: record.createdBy ?? record.employee,
            serviceType: record.ServiceName ?? record.serviceName ?? record.serviceType,
            status: record.status ?? firstTask?.status,
            createdAt: firstTask?.createdAt ?? record.createdAt,
            lastUpdated: record.decisionAt ?? record.lastUpdated ?? firstTask?.completedAt,
            serviceDetails
          } as ManagerTask;
        })
      )
    );
  }

  /**
   * Submit manager decision (approve/reject)
   */
  makeDecision(decision: ManagerDecisionDto): Observable<any> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.manager.decision}`;
    console.log('✅ [MANAGER SERVICE] Submitting decision:', decision);
    const payload = {
      taskId: decision.taskId,
      isApproved: decision.isApproved
    };
    // Backend may return 200 with an empty body; default JSON parsing would throw and surface as error.
    return this.http.post(url, payload, { responseType: 'text' }).pipe(
      map((body) => {
        const trimmed = body?.trim();
        if (!trimmed) return null;
        try {
          return JSON.parse(trimmed) as unknown;
        } catch {
          return body;
        }
      })
    );
  }
}
