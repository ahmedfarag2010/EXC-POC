import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';

@Component({
  selector: 'app-request-detail',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.scss'
})
export class RequestDetailComponent {
  private route = inject(ActivatedRoute);
  
  requestId: string | null = null;
  
  // TODO: Replace with actual service call
  request = {
    id: 'AS-5R921',
    employee: 'Sarah Al-Maarouf',
    serviceType: 'AHAD Exit Re-Entry Visa',
    submissionDate: '14-February-2025',
    lastUpdated: '14-February-2025',
    status: 'Approved',
    serviceDetails: {
      iqamaNumber: '202X/2021',
      duration: '1 Month',
      visaType: 'Single',
      visaFees: 'Yes',
      justification: 'Business travel requirement for international conference attendance.'
    },
    updateHistory: [
      { date: '14-February-2025', action: 'Request submitted', actor: 'Sarah Al-Maarouf' },
      { date: '14-February-2025', action: 'Request approved', actor: 'Manager' }
    ]
  };

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('requestId');
    // TODO: Fetch request details based on requestId
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
}
