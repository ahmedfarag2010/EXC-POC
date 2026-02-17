import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  taskId: string | null = null;
  
  // TODO: Replace with actual service call
  task = {
    id: 'AS-5R921',
    employee: 'Sarah Al-Maarouf',
    serviceType: 'AHAD Exit Re-Entry Visa',
    submissionDate: '14-February-2025',
    lastUpdated: '14-February-2025',
    status: 'Pending',
    serviceDetails: {
      iqamaNumber: '202X/2021',
      duration: '1 Month',
      visaType: 'Single',
      visaFees: 'Yes',
      justification: 'Business travel requirement for international conference attendance.'
    },
    updateHistory: [
      { date: '14-February-2025', action: 'Request submitted', actor: 'Sarah Al-Maarouf' }
    ]
  };

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('taskId');
    // TODO: Fetch task details based on taskId
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Approved': 'status-approved',
      'Delegated': 'status-delegated',
      'Rejected': 'status-rejected'
    };
    return statusMap[status] || 'status-pending';
  }

  approveTask(): void {
    // TODO: Implement approve logic
    console.log('Approve task');
    // After approval, redirect to tasks list
    // this.router.navigate(['/my-tasks']);
  }

  rejectTask(): void {
    // TODO: Implement reject logic
    console.log('Reject task');
    // After rejection, redirect to tasks list
    // this.router.navigate(['/my-tasks']);
  }

  delegateTask(): void {
    // TODO: Implement delegate logic
    console.log('Delegate task');
  }
}
