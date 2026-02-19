import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { ManagerService } from '../../../core/services/manager.service';
import { ManagerTask } from '../../../core/models/manager.models';
import { RequestStatus } from '../../../core/models/request.models';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private managerService = inject(ManagerService);

  taskId: string | null = null;
  task: ManagerTask | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('taskId');
    if (this.taskId) {
      this.loadTask();
    }
  }

  loadTask(): void {
    // Note: API might not have a get-by-id endpoint, so we'll load from tasks list
    // For now, we'll use the taskId to identify the task
    this.isLoading = true;
    this.managerService.getManagerTasks().subscribe({
      next: (tasks: ManagerTask[]) => {
        const foundTask = tasks.find(t => t.id === this.taskId || t.requestId === this.taskId);
        if (foundTask) {
          this.task = foundTask;
        } else {
          this.errorMessage = 'Task not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [TASK DETAIL] Failed to load task:', error);
        this.errorMessage = 'Failed to load task details.';
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

  approveTask(): void {
    if (!this.taskId) return;
    
    this.submitDecision(true);
  }

  rejectTask(): void {
    if (!this.taskId) return;
    
    this.submitDecision(false);
  }

  private submitDecision(isApproved: boolean): void {
    if (!this.taskId) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const decision = {
      requestId: this.taskId,
      isApproved: isApproved
    };

    console.log('✅ [TASK DETAIL] Submitting decision:', decision);

    this.managerService.makeDecision(decision).subscribe({
      next: (response) => {
        console.log('✅ [TASK DETAIL] Decision submitted successfully:', response);
        this.successMessage = isApproved ? 'Request approved successfully!' : 'Request rejected successfully!';
        this.isSubmitting = false;
        
        // Redirect to tasks list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/my-tasks']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ [TASK DETAIL] Failed to submit decision:', error);
        this.errorMessage = error.error?.message || 'Failed to submit decision. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  delegateTask(): void {
    // TODO: Implement delegate logic if API supports it
    console.log('Delegate task');
    this.errorMessage = 'Delegation feature not yet implemented.';
  }
}
