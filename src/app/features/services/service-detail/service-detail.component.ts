import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';

@Component({
  selector: 'app-service-detail',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent {
  private route = inject(ActivatedRoute);
  
  serviceId: string | null = null;
  
  // TODO: Replace with actual service call
  service = {
    id: 1,
    name: 'AHAD Exit Re-Entry Visa',
    description: 'IOC Employees. Facilitating safe and planned international returns.',
    category: 'AHAD Services'
  };

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId');
    // TODO: Fetch service details based on serviceId
  }
}
