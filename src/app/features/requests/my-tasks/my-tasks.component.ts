import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { ManagerService } from '../../../core/services/manager.service';
import { ManagerTask } from '../../../core/models/manager.models';
import { RequestStatus } from '../../../core/models/request.models';

@Component({
  selector: 'app-my-tasks',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss'
})
export class MyTasksComponent implements OnInit {
  private managerService = inject(ManagerService);

  tasks: ManagerTask[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.managerService.getManagerTasks().subscribe({
      next: (data: ManagerTask[]) => {
        console.log('✅ [MY TASKS] Tasks loaded:', data);
        this.tasks = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [MY TASKS] Failed to load tasks:', error);
        this.errorMessage = 'Failed to load tasks. Please try again later.';
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

  approveTask(taskId: string): void {
    // Navigation handled by routerLink to detail page
  }

  rejectTask(taskId: string): void {
    // Navigation handled by routerLink to detail page
  }

  viewDetails(taskId: string): void {
    // Navigation handled by routerLink
  }
}
