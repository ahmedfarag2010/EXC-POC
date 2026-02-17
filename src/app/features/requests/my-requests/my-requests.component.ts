import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';

@Component({
  selector: 'app-my-requests',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss'
})
export class MyRequestsComponent {
  // TODO: Replace with actual service call
  requests = [
    {
      id: 'AS-5R921',
      serviceType: 'AHAD Exit Re-Entry Visa',
      submissionDate: '16-February-2026',
      lastUpdated: '16-February-2026',
      status: 'Approved'
    },
    {
      id: 'AS-1R799',
      serviceType: 'AHAD Exit Re-Entry Visa',
      submissionDate: '15-February-2026',
      lastUpdated: '15-February-2026',
      status: 'Pending'
    },
    {
      id: 'AS-2R800',
      serviceType: 'IT Support Services',
      submissionDate: '14-February-2026',
      lastUpdated: '14-February-2026',
      status: 'Delegated'
    }
  ];

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Approved': 'status-approved',
      'Delegated': 'status-delegated',
      'Rejected': 'status-rejected'
    };
    return statusMap[status] || 'status-pending';
  }
}
