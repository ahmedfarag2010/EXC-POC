import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';

@Component({
  selector: 'app-my-tasks',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss'
})
export class MyTasksComponent {
  // TODO: Replace with actual service call
  tasks = [
    {
      id: 'AS-5R921',
      employee: 'Hamadi Al Jaber',
      serviceType: 'AHAD Exit Re-Entry Visa',
      submissionDate: '16-February-2026',
      lastUpdated: '16-February-2026',
      status: 'Pending'
    },
    {
      id: 'AS-1R799',
      employee: 'Abdullah Obaid',
      serviceType: 'IT Support Services',
      submissionDate: '15-February-2026',
      lastUpdated: '15-February-2026',
      status: 'Pending'
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

  approveTask(taskId: string): void {
    // TODO: Implement approve logic
    console.log('Approve task:', taskId);
  }

  rejectTask(taskId: string): void {
    // TODO: Implement reject logic
    console.log('Reject task:', taskId);
  }

  viewDetails(taskId: string): void {
    // Navigation handled by routerLink
  }
}
