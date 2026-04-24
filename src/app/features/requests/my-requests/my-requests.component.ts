import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { RequestsService } from '../../../core/services/requests.service';
import { Request, RequestStatus } from '../../../core/models/request.models';

@Component({
  selector: 'app-my-requests',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss'
})
export class MyRequestsComponent implements OnInit {
  private requestsService = inject(RequestsService);

  requests: Request[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(status?: RequestStatus): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.requestsService.getMyRequests(status).subscribe({
      next: (data: Request[]) => {
        console.log('✅ [MY REQUESTS] Requests loaded:', data);
        this.requests = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [MY REQUESTS] Failed to load requests:', error);
        this.errorMessage = 'Failed to load requests. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: number | string): string {
    const statusKey = typeof status === 'string' ? status.toLowerCase().replace(/\s+/g, '') : '';
    if (statusKey === 'inprogress') {
      return 'status-inprogress';
    }
    const statusNum = typeof status === 'string' ? this.parseStatus(status) : status;
    const statusMap: { [key: number]: string } = {
      [RequestStatus.InProgress]: 'status-inprogress',
      [RequestStatus.Approved]: 'status-approved',
      [RequestStatus.Rejected]: 'status-rejected'
    };
    return statusMap[statusNum] || '';
  }

  getStatusDisplay(status: number | string): string {
    if (typeof status === 'string' && !status.match(/^\d+$/)) {
      const statusKey = status.toLowerCase().replace(/\s+/g, '');
      const statusTextMap: { [key: string]: string } = {
        inprogress: 'In Progress',
        approved: 'Approved',
        rejected: 'Rejected'
      };
      return statusTextMap[statusKey] || status;
    }
    const statusNum = typeof status === 'string' ? this.parseStatus(status) : status;
    const statusMap: { [key: number]: string } = {
      [RequestStatus.InProgress]: 'In Progress',
      [RequestStatus.Approved]: 'Approved',
      [RequestStatus.Rejected]: 'Rejected'
    };
    return statusMap[statusNum] || String(status ?? 'N/A');
  }

  private parseStatus(status: string): number {
    if (/^\d+$/.test(status)) {
      return Number(status);
    }
    const statusMap: { [key: string]: number } = {
      pending: RequestStatus.InProgress,
      inprogress: RequestStatus.InProgress,
      approved: RequestStatus.Approved,
      rejected: RequestStatus.Rejected
    };
    return statusMap[status.toLowerCase()] || Number.NaN;
  }
}
