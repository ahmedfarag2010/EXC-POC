import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { RequestsService } from '../../../core/services/requests.service';
import { LookupsService } from '../../../core/services/lookups.service';
import { ServicesCatalogService } from '../../../core/services/services-catalog.service';
import {
  CreateRequestDto,
  VisaType,
  VisaRequestType,
  Duration
} from '../../../core/models/request.models';
import { ServiceDetail, ServiceFieldControl } from '../../../core/models/service.models';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';

function minArrayLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (!Array.isArray(v) || v.length < min) {
      return { minArrayLength: { min, actual: Array.isArray(v) ? v.length : 0 } };
    }
    return null;
  };
}

@Component({
  selector: 'app-service-detail',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HeaderComponent,
    ConfirmationPopupComponent
  ],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private requestsService = inject(RequestsService);
  private lookupsService = inject(LookupsService);
  private catalogService = inject(ServicesCatalogService);
  private fb = inject(FormBuilder);

  serviceId: string | null = null;
  showPopup = false;

  service: ServiceDetail | null = null;
  useDynamicForm = false;

  requestForm: FormGroup | null = null;
  detailLoading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  durationOptions: { value: Duration; label: string }[] = [
    { value: Duration.OneMonth, label: '1 Month' },
    { value: Duration.TwoMonths, label: '2 Months' },
    { value: Duration.ThreeMonths, label: '3 Months' },
    { value: Duration.FourMonths, label: '4 Months' },
    { value: Duration.FiveMonths, label: '5 Months' }
  ];

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId');
    if (!this.serviceId) {
      this.errorMessage = 'Service not found.';
      return;
    }
    this.loadService();
  }

  rangeStartName(c: ServiceFieldControl): string {
    return `${c.name}_start`;
  }

  rangeEndName(c: ServiceFieldControl): string {
    return `${c.name}_end`;
  }

  onCheckboxChange(
    controlName: string,
    value: string | number,
    checked: boolean
  ): void {
    const form = this.requestForm;
    if (!form) {
      return;
    }
    const control = form.get(controlName);
    if (!control) {
      return;
    }
    let list = control.value as (string | number)[];
    if (!Array.isArray(list)) {
      list = [];
    }
    const v = value;
    if (checked) {
      if (!list.includes(v)) {
        list = [...list, v];
      }
    } else {
      list = list.filter((x) => x !== v);
    }
    control.setValue(list);
    control.markAsTouched();
  }

  isCheckboxChecked(controlName: string, value: string | number): boolean {
    const form = this.requestForm;
    if (!form) {
      return false;
    }
    const list = form.get(controlName)?.value;
    return Array.isArray(list) && list.includes(value);
  }

  onFileChange(event: Event, c: ServiceFieldControl): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.requestForm?.get(c.name)?.setValue(file);
    this.requestForm?.get(c.name)?.markAsTouched();
  }

  private loadService(): void {
    this.detailLoading = true;
    this.errorMessage = '';
    this.catalogService.getServiceById(this.serviceId!).subscribe({
      next: (detail: ServiceDetail) => {
        this.service = detail;
        this.useDynamicForm = detail.controls.length > 0;
        if (this.useDynamicForm) {
          this.requestForm = this.buildDynamicForm(detail.controls);
        } else {
          this.initStaticVisaForm();
          this.loadDurationOptions();
        }
        this.detailLoading = false;
      },
      error: (err: unknown) => {
        console.error('[SERVICE DETAIL] Failed to load service:', err);
        const msg =
          err && typeof err === 'object' && 'error' in err
            ? (err as { error?: { message?: string } }).error?.message
            : undefined;
        this.errorMessage = msg ?? 'Failed to load this service. Please go back and try again.';
        this.detailLoading = false;
      }
    });
  }

  private buildDynamicForm(controls: ServiceFieldControl[]): FormGroup {
    const group: Record<string, FormControl<unknown | null>> = {};
    for (const c of controls) {
      const req = c.required ? [Validators.required] : [];

      switch (c.type) {
        case 'dateRange': {
          const start = this.fb.control<string>('', { validators: c.required ? [Validators.required] : [] });
          const end = this.fb.control<string>('', { validators: c.required ? [Validators.required] : [] });
          group[this.rangeStartName(c)] = start;
          group[this.rangeEndName(c)] = end;
          break;
        }
        case 'checkbox': {
          const v = c.required ? [minArrayLength(1)] : [];
          group[c.name] = this.fb.control<(string | number)[]>([], { validators: v });
          break;
        }
        case 'file': {
          group[c.name] = this.fb.control<File | null>(null, {
            validators: c.required ? [Validators.required] : []
          });
          break;
        }
        case 'number': {
          const num = Validators.pattern(/^$|^[0-9]+((\.|,)[0-9]+)?$/u);
          group[c.name] = this.fb.control<string>('', {
            validators: c.required ? [Validators.required, num] : [num]
          });
          break;
        }
        case 'select': {
          group[c.name] = this.fb.control<string | number | null>(null, { validators: req });
          break;
        }
        case 'boolean': {
          if (c.options.length) {
            const first = c.options[0]!.value;
            group[c.name] = this.fb.control<string | number | boolean | null>(first, { validators: req });
          } else {
            group[c.name] = this.fb.control<boolean | null>(c.required ? null : false, {
              validators: c.required ? [Validators.required] : []
            });
          }
          break;
        }
        case 'date':
        case 'text':
        case 'textarea':
        case 'radio': {
          group[c.name] = this.fb.control<string>('', { validators: req });
          break;
        }
      }
    }
    return this.fb.group(group) as FormGroup;
  }

  private initStaticVisaForm(): void {
    this.requestForm = this.fb.group({
      iqamaNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      duration: ['', [Validators.required]],
      visaType: [VisaType.Single, [Validators.required]],
      type: [VisaRequestType.SingleVisa, [Validators.required]],
      visaFees: [true, [Validators.required]],
      justification: ['']
    });
  }

  private loadDurationOptions(): void {
    this.lookupsService.getLookups().subscribe({
      next: (data: any) => {
        const apiDurations = data?.durations ?? data?.durationOptions ?? data?.Duration;

        if (Array.isArray(apiDurations) && apiDurations.length) {
          const first = apiDurations[0];

          if (typeof first === 'number') {
            this.durationOptions = apiDurations.map((d: number) => ({
              value: d as Duration,
              label: `${d} Month${d > 1 ? 's' : ''}`
            }));
          } else if (typeof first === 'object') {
            this.durationOptions = apiDurations.map((d: any) => ({
              value: (d.id ?? d.value ?? d.duration) as Duration,
              label: (d.name ?? d.label ?? `${d.id} Month${d.id > 1 ? 's' : ''}`) as string
            }));
          }
        }
      },
      error: (error) => {
        console.error('❌ [SERVICE DETAIL] Failed to load durations from lookups:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.saving) {
      return;
    }
    if (!this.requestForm || !this.serviceId) {
      return;
    }
    const form = this.requestForm;
    if (form.invalid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.useDynamicForm && this.service) {
      this.submitDynamic();
    } else {
      this.submitStatic();
    }
  }

  private submitDynamic(): void {
    void (async () => {
      let body: { serviceId: string; JsonData: string };
      try {
        body = await this.buildDynamicRequestBody();
      } catch (e) {
        console.error('[SERVICE DETAIL] Build body failed', e);
        this.errorMessage = 'Could not read form data. Please check file fields and try again.';
        this.saving = false;
        return;
      }
      this.requestsService.createServiceRequest(body).subscribe({
        next: (response) => {
          console.log('[SERVICE DETAIL] Request created:', response);
          this.successMessage = 'Request submitted successfully!';
          this.saving = false;
          this.showPopup = true;
        },
        error: (error) => {
          console.error('[SERVICE DETAIL] Failed to create request:', error);
          this.errorMessage = error.error?.message ?? 'Failed to submit request. Please try again.';
          this.saving = false;
        }
      });
    })();
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(new Error('File read failed'));
      r.readAsDataURL(file);
    });
  }

  /**
   * Match API control objects to our field metadata (same key order as ServicesCatalogService).
   */
  private apiControlKey(o: Record<string, unknown>): string {
    return String(
      o['formControlName'] ??
        o['FormControlName'] ??
        o['name'] ??
        o['Name'] ??
        o['fieldName'] ??
        ''
    );
  }

  private async buildDynamicRequestBody(): Promise<{ serviceId: string; JsonData: string }> {
    const form = this.requestForm;
    if (!form || !this.service) {
      return { serviceId: this.serviceId ?? '', JsonData: '[]' };
    }
    const service = this.service;
    const raw = form.getRawValue() as Record<string, unknown>;
    const template = JSON.parse(JSON.stringify(service.controlsJsonTemplate ?? [])) as unknown[];

    for (const item of template) {
      if (item === null || typeof item !== 'object' || Array.isArray(item)) {
        continue;
      }
      const o = item as Record<string, unknown>;
      const key = this.apiControlKey(o);
      const def = key ? service.controls.find((fc) => fc.name === key) : undefined;
      o['value'] = def ? await this.resolveValueForField(def, raw) : null;
    }

    return {
      serviceId: this.serviceId!,
      JsonData: JSON.stringify(template)
    };
  }

  private async resolveValueForField(
    c: ServiceFieldControl,
    raw: Record<string, unknown>
  ): Promise<unknown> {
    if (c.type === 'dateRange') {
      const s = this.rangeStartName(c);
      const e = this.rangeEndName(c);
      return {
        start: raw[s] ?? null,
        end: raw[e] ?? null
      };
    }

    const v = raw[c.name];

    if (c.type === 'file') {
      if (v instanceof File) {
        const data = await this.readFileAsDataUrl(v);
        return { fileName: v.name, contentType: v.type, data };
      }
      return null;
    }

    if (c.type === 'checkbox') {
      return Array.isArray(v) ? v : [];
    }

    if (c.type === 'number') {
      if (v === '' || v == null) {
        return null;
      }
      return Number(String(v).replace(',', '.'));
    }

    if (c.type === 'boolean') {
      if (v === 'true' || v === true || v === 1 || v === '1') {
        return true;
      }
      if (v === 'false' || v === false || v === 0 || v === '0') {
        return false;
      }
      return v;
    }

    if (c.type === 'date' && v) {
      return v;
    }

    if (c.type === 'select') {
      if (v === '' || v == null) {
        return null;
      }
      if (c.options.length) {
        const num = Number(v);
        if (!Number.isNaN(num) && String(v) === String(num)) {
          return num;
        }
      }
      return v;
    }

    return v;
  }

  private submitStatic(): void {
    if (!this.requestForm) {
      return;
    }
    const formValue = this.requestForm.value;
    const requestDto: CreateRequestDto = {
      iqamaNumber: formValue.iqamaNumber,
      duration: parseInt(formValue.duration, 10),
      visaType: parseInt(formValue.visaType, 10),
      type: parseInt(formValue.type, 10),
      visaFees: formValue.visaFees === true || formValue.visaFees === 'yes',
      justification: formValue.justification || null
    };

    this.requestsService.createRequest(this.serviceId!, requestDto).subscribe({
      next: (response) => {
        console.log('[SERVICE DETAIL] Request created successfully:', response);
        this.successMessage = 'Request submitted successfully!';
        this.saving = false;
        this.showPopup = true;
      },
      error: (error) => {
        console.error('[SERVICE DETAIL] Failed to create request:', error);
        this.errorMessage = error.error?.message ?? 'Failed to submit request. Please try again.';
        this.saving = false;
      }
    });
  }
}
