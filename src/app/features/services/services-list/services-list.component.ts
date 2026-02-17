import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';

@Component({
  selector: 'app-services-list',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent {
  // TODO: Replace with actual service call
  services = [
    { id: 1, name: 'AHAD Exit Re-Entry Visa', description: 'IOC Employees. Facilitating safe and planned international returns.', category: 'IT Support Services' },
    { id: 2, name: 'IT Support Services', description: 'Technical support for IT-related issues.', category: 'IT Support Services' },
    { id: 3, name: 'Infrastructure Services', description: 'Infrastructure and network support.', category: 'Infrastructure Services' }
  ];

  categories = [
    'IT Support Services',
    'Infrastructure Services',
    'Enterprise Applications',
    'Facilities Services',
    'Internal Communications',
    'Finance Services',
    'Procurement Tools Services',
    'Contact Center Inquiries',
    'Vendor Management',
    'Contracts'
  ];

  selectedCategory = 'All';
  filterType = 'All'; // 'All' or 'Popular'
}
