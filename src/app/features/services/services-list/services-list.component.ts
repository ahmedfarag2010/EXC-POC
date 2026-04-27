import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { LookupsService } from '../../../core/services/lookups.service';
import { ServicesCatalogService } from '../../../core/services/services-catalog.service';
import { LookupData } from '../../../core/models/lookup.models';
import { ServiceSummary } from '../../../core/models/service.models';

@Component({
  selector: 'app-services-list',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  private lookupsService = inject(LookupsService);
  private catalogService = inject(ServicesCatalogService);

  services: ServiceSummary[] = [];
  categories: string[] = [];
  selectedCategory = 'All';
  filterType = 'All';
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      services: this.catalogService.getServices().pipe(
        catchError((err) => {
          console.error('[SERVICES LIST] Failed to load services:', err);
          this.errorMessage = 'Failed to load services. Please try again later.';
          return of([] as ServiceSummary[]);
        })
      ),
      lookups: this.lookupsService.getLookups().pipe(
        catchError((err) => {
          console.error('[SERVICES LIST] Failed to load lookups:', err);
          return of({} as LookupData);
        })
      )
    }).subscribe({
      next: ({ services, lookups }) => {
        this.services = services;
        this.applyCategories(lookups, services);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private applyCategories(lookups: LookupData, serviceList: ServiceSummary[]): void {
    const fromApi = new Set(
      serviceList
        .map((s) => s.category)
        .filter((c): c is string => typeof c === 'string' && c.length > 0)
    );
    if (fromApi.size > 0) {
      this.categories = ['All', ...Array.from(fromApi).sort((a, b) => a.localeCompare(b))];
      return;
    }
    if (lookups.categories?.length) {
      this.categories = lookups.categories.map((cat) => cat.name);
      return;
    }
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
}
