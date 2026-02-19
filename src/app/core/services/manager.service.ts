import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<ManagerTask[]>(url);
  }

  /**
   * Submit manager decision (approve/reject)
   */
  makeDecision(decision: ManagerDecisionDto): Observable<any> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.manager.decision}`;
    console.log('✅ [MANAGER SERVICE] Submitting decision:', decision);
    return this.http.post(url, decision);
  }
}
