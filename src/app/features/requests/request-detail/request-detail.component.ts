import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { RequestsService } from '../../../core/services/requests.service';
import { Request, RequestStatus } from '../../../core/models/request.models';

@Component({
  selector: 'app-request-detail',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.scss'
})
export class RequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private requestsService = inject(RequestsService);

  requestId: string | null = null;
  request: Request | null = null;
  serviceDetailRows: Array<{
    label: string;
    value: string;
    isImage?: boolean;
    imageSrc?: string;
  }> = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('requestId');
    if (this.requestId) {
      this.loadRequestDetails(this.requestId);
    } else {
      this.errorMessage = 'Request ID is missing.';
    }
  }

  private loadRequestDetails(requestId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    // No GET-by-id endpoint; load from list and match by id (same pattern as task detail)
    this.requestsService.getMyRequests().subscribe({
      next: (requests) => {
        const found = requests.find((r) => r.id === requestId);
        if (found) {
          this.request = found;
          this.serviceDetailRows = this.parseServiceDetailsRows(found);
        } else {
          this.errorMessage = 'Request not found.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [REQUEST DETAIL] Failed to load requests:', error);
        this.errorMessage = 'Failed to load request details.';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: number | string): string {
    const statusKey = typeof status === 'string' ? status.toLowerCase().replace(/\s+/g, '') : '';
    if (statusKey === 'inprogress') {
      return 'status-inprogress';
    }
    const statusNum = typeof status === 'string' ? this.parseStatus(status) : status;
    const statusMap: { [key: number]: string } = {
      [RequestStatus.InProgress]: 'status-inprogress',
      [RequestStatus.Approved]: 'status-approved',
      [RequestStatus.Rejected]: 'status-rejected'
    };
    return statusMap[statusNum] || '';
  }

  getStatusDisplay(status: number | string): string {
    if (typeof status === 'string' && !status.match(/^\d+$/)) {
      const statusKey = status.toLowerCase().replace(/\s+/g, '');
      const statusTextMap: { [key: string]: string } = {
        inprogress: 'In Progress',
        approved: 'Approved',
        rejected: 'Rejected'
      };
      return statusTextMap[statusKey] || status;
    }
    const statusNum = typeof status === 'string' ? this.parseStatus(status) : status;
    const statusMap: { [key: number]: string } = {
      [RequestStatus.InProgress]: 'In Progress',
      [RequestStatus.Approved]: 'Approved',
      [RequestStatus.Rejected]: 'Rejected'
    };
    return statusMap[statusNum] || String(status ?? 'N/A');
  }

  private parseStatus(status: string): number {
    if (/^\d+$/.test(status)) {
      return Number(status);
    }
    const statusMap: { [key: string]: number } = {
      pending: RequestStatus.InProgress,
      inprogress: RequestStatus.InProgress,
      approved: RequestStatus.Approved,
      rejected: RequestStatus.Rejected
    };
    return statusMap[status.toLowerCase()] || Number.NaN;
  }

  private parseServiceDetailsRows(request: Request): Array<{
    label: string;
    value: string;
    isImage?: boolean;
    imageSrc?: string;
  }> {
    const rawJsonData = (request as any)?.jsonData ?? (request as any)?.JsonData;
    if (typeof rawJsonData !== 'string' || rawJsonData.trim() === '') {
      return [];
    }

    try {
      const parsed = JSON.parse(rawJsonData) as any[];
      console.log('✅ [REQUEST DETAIL] Parsed jsonData:', parsed);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item) => item && typeof item === 'object')
        .map((item) => {
          const label = String(item.label ?? item.Label ?? 'N/A');
          const type = String(item.type ?? item.Type ?? '').toLowerCase();
          const imageSrc = type === 'file' ? this.extractImageSrc(item.value) : null;
          if (imageSrc) {
            return { label, value: '', isImage: true, imageSrc };
          }
          const value = this.extractDisplayValue(item.value);
          return { label, value, isImage: false };
        });
    } catch (error) {
      console.error('❌ [REQUEST DETAIL] Failed to parse jsonData:', error);
      return [];
    }
  }

  /**
   * Mapping rules:
   * 1) If value is array -> use value[0]
   * 2) If chosen value is object -> use chosen.label (dropdown/radio style)
   */
  private extractDisplayValue(rawValue: unknown): string {
    const first = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (first === undefined || first === null || first === '') {
      return 'N/A';
    }
    if (typeof first === 'object') {
      const obj = first as Record<string, unknown>;
      if (typeof obj['label'] === 'string' && obj['label'].trim() !== '') {
        return obj['label'];
      }
      if (typeof obj['start'] === 'string' || typeof obj['end'] === 'string') {
        const start = typeof obj['start'] === 'string' ? obj['start'] : '';
        const end = typeof obj['end'] === 'string' ? obj['end'] : '';
        return [start, end].filter(Boolean).join(' - ') || 'N/A';
      }
      return 'N/A';
    }
    return String(first);
  }

  private extractImageSrc(rawValue: unknown): string | null {
    const first = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (!first || typeof first !== 'object') {
      return null;
    }
    const obj = first as Record<string, unknown>;
    const data = obj['data'];
    if (typeof data !== 'string' || data.trim() === '') {
      return null;
    }
    // Handle both full data URLs and raw base64 payloads.
    if (data.startsWith('data:')) {
      return data;
    }
    const contentType =
      typeof obj['contentType'] === 'string' && obj['contentType'].trim() !== ''
        ? obj['contentType']
        : 'image/png';
    return `data:${contentType};base64,${data}`;
  }
}
