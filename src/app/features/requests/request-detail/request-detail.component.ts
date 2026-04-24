import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { RequestsService } from '../../../core/services/requests.service';
import { Request, RequestStatus } from '../../../core/models/request.models';

@Component({
  selector: 'app-request-detail',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.scss'
})
export class RequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private requestsService = inject(RequestsService);

  requestId: string | null = null;
  request: Request | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('requestId');
    if (this.requestId) {
      this.loadRequestDetails(this.requestId);
    } else {
      this.errorMessage = 'Request ID is missing.';
    }
  }

  private loadRequestDetails(requestId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    // No GET-by-id endpoint; load from list and match by id (same pattern as task detail)
    this.requestsService.getMyRequests().subscribe({
      next: (requests) => {
        const found = requests.find((r) => r.id === requestId);
        if (found) {
          this.request = found;
        } else {
          this.errorMessage = 'Request not found.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [REQUEST DETAIL] Failed to load requests:', error);
        this.errorMessage = 'Failed to load request details.';
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
