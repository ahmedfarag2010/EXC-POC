import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { LookupsService } from '../../../core/services/lookups.service';
import { LookupData } from '../../../core/models/lookup.models';

@Component({
  selector: 'app-services-list',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  private lookupsService = inject(LookupsService);

  private readonly singleServiceCard = {
    id: 1,
    name: 'AHAD Exit Re-Entry Visa',
    description: 'IOC Employees. Facilitating safe and planned international returns.',
    category: 'AHAD Services'
  };

  services: any[] = [this.singleServiceCard];
  categories: string[] = [];
  selectedCategory = 'All';
  filterType = 'All'; // 'All' or 'Popular'
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadLookups();
  }

  loadLookups(): void {
    this.isLoading = true;
    this.errorMessage = '';
    // Always show the single service card (POC requirement)
    this.services = [this.singleServiceCard];

    this.lookupsService.getLookups().subscribe({
      next: (data: LookupData) => {
        console.log('✅ [SERVICES LIST] Lookups loaded:', data);
        
        // Extract categories and services from lookup data
        // Adjust based on actual API response structure
        if (data.categories) {
          this.categories = data.categories.map(cat => cat.name);
        }
        // Services page requirement (POC): show only one service card.
        // Keep the hardcoded single service above, regardless of API response.
        this.services = [this.singleServiceCard];

        // Fallback to default categories if API doesn't return them
        if (this.categories.length === 0) {
          this.categories = [
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
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [SERVICES LIST] Failed to load lookups:', error);
        this.errorMessage = 'Failed to load services. Please try again later.';
        this.isLoading = false;
        
        // Fallback to default data
        this.categories = [
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
        // Keep single service card even on error.
        this.services = [this.singleServiceCard];
      }
    });
  }
}
