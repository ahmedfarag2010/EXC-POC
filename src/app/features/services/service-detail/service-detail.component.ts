import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { RequestsService } from '../../../core/services/requests.service';
import { LookupsService } from '../../../core/services/lookups.service';
import { CreateRequestDto, VisaType, VisaRequestType, Duration } from '../../../core/models/request.models';

@Component({
  selector: 'app-service-detail',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private requestsService = inject(RequestsService);
  private lookupsService = inject(LookupsService);
  private fb = inject(FormBuilder);

  serviceId: string | null = null;
  service = {
    id: 1,
    name: 'AHAD Exit Re-Entry Visa',
    description: 'IOC Employees. Facilitating safe and planned international returns.',
    category: 'AHAD Services'
  };

  requestForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  durationOptions: { value: Duration; label: string }[] = [
    { value: Duration.OneMonth,  label: '1 Month' },
    { value: Duration.TwoMonths, label: '2 Months' },
    { value: Duration.ThreeMonths, label: '3 Months' },
    { value: Duration.FourMonths,  label: '4 Months' },
    { value: Duration.FiveMonths,  label: '5 Months' }
  ];

  constructor() {
    this.requestForm = this.fb.group({
      iqamaNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      duration: ['', [Validators.required]],
      visaType: [VisaType.Single, [Validators.required]],
      type: [VisaRequestType.SingleVisa, [Validators.required]],
      visaFees: [true, [Validators.required]],
      justification: ['']
    });
  }

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId');
    // TODO: Fetch service details based on serviceId if API provides this endpoint
    this.loadDurationOptions();
  }

  private loadDurationOptions(): void {
    this.lookupsService.getLookups().subscribe({
      next: (data: any) => {
        console.log('📋 [SERVICE DETAIL] Lookups for duration:', data);
        const apiDurations = data?.durations ?? data?.durationOptions ?? data?.Duration;

        if (Array.isArray(apiDurations) && apiDurations.length) {
          const first = apiDurations[0];

          // Case 1: array of numbers (matches Duration enum)
          if (typeof first === 'number') {
            this.durationOptions = apiDurations.map((d: number) => ({
              value: d as Duration,
              label: `${d} Month${d > 1 ? 's' : ''}`
            }));
          } else if (typeof first === 'object') {
            // Case 2: array of objects with id/name or value/label
            this.durationOptions = apiDurations.map((d: any) => ({
              value: (d.id ?? d.value ?? d.duration) as Duration,
              label: (d.name ?? d.label ?? `${d.id} Month${d.id > 1 ? 's' : ''}`) as string
            }));
          }
        }
      },
      error: (error) => {
        console.error('❌ [SERVICE DETAIL] Failed to load durations from lookups:', error);
        // Keep default durationOptions on error
      }
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.requestForm.value;
      const requestDto: CreateRequestDto = {
        iqamaNumber: formValue.iqamaNumber,
        duration: parseInt(formValue.duration),
        visaType: parseInt(formValue.visaType),
        type: parseInt(formValue.type),
        visaFees: formValue.visaFees === true || formValue.visaFees === 'yes',
        justification: formValue.justification || null
      };

      console.log('📝 [SERVICE DETAIL] Submitting request:', requestDto);

      this.requestsService.createRequest(requestDto).subscribe({
        next: (response) => {
          console.log('✅ [SERVICE DETAIL] Request created successfully:', response);
          this.successMessage = 'Request submitted successfully!';
          this.isLoading = false;
          
          // Redirect to my-requests after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/my-requests']);
          }, 2000);
        },
        error: (error) => {
          console.error('❌ [SERVICE DETAIL] Failed to create request:', error);
          this.errorMessage = error.error?.message || 'Failed to submit request. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.requestForm.controls).forEach(key => {
        this.requestForm.get(key)?.markAsTouched();
      });
    }
  }
}
