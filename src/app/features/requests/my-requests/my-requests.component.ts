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
        this.requests = data.map(request => ({
          ...request,
          // Map status enum to display string
          statusDisplay: this.getStatusDisplay(request.status)
        }));
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
    const statusNum = typeof status === 'string' ? this.parseStatus(status) : status;
    const statusMap: { [key: number]: string } = {
      [RequestStatus.Pending]: 'status-pending',
      [RequestStatus.Approved]: 'status-approved',
      [RequestStatus.Rejected]: 'status-rejected'
    };
    return statusMap[statusNum] || 'status-pending';
  }

  getStatusDisplay(status: number | string): string {
    if (typeof status === 'string' && !status.match(/^\d+$/)) {
      // If it's already a display string, return it
      return status;
    }
    const statusNum = typeof status === 'string' ? this.parseStatus(status) : status;
    const statusMap: { [key: number]: string } = {
      [RequestStatus.Pending]: 'Pending',
      [RequestStatus.Approved]: 'Approved',
      [RequestStatus.Rejected]: 'Rejected'
    };
    return statusMap[statusNum] || 'Pending';
  }

  private parseStatus(status: string): number {
    const statusMap: { [key: string]: number } = {
      'Pending': RequestStatus.Pending,
      'Approved': RequestStatus.Approved,
      'Rejected': RequestStatus.Rejected
    };
    return statusMap[status] || RequestStatus.Pending;
  }
}
