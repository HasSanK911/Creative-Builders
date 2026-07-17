import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Site, SitePayment, SiteStatus, SiteType } from '../../../models/api.models';

@Component({
  selector: 'app-add-site',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.css'
})
export class AddSiteComponent implements OnInit {

  constructor(
    private api: ApiService<Site>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /** Set from `?id=` — its presence is what puts the screen in edit mode. */
  siteId: string | null = null;
  loading = false;
  saving = false;
  error = '';

  name = '';
  location = '';
  type: SiteType | '' = '';
  status: SiteStatus | '' = '';

  readonly types: SiteType[] = ['Home', 'Office', 'Building'];
  readonly statuses: SiteStatus[] = ['Pending', 'Completed', 'Dispute'];
  isTypeOpen = false;
  isStatusOpen = false;

  // --- Payment Properties ---
  totalBudget: number | null = null;
  advanceReceived: number | null = null;
  remainingBalance: string = '0';
  payments: SitePayment[] = [
    { date: null, amount: null, description: '' }
  ];

  ngOnInit(): void {
    this.siteId = this.route.snapshot.queryParamMap.get('id');
    if (this.siteId) {
      this.loadSite(this.siteId);
    }
  }

  private loadSite(id: string): void {
    this.loading = true;
    this.error = '';

    this.api.getById(`sites/${id}`).subscribe({
      next: site => {
        this.name = site.name;
        this.location = site.location;
        this.type = site.type;
        this.status = site.status;
        this.totalBudget = site.budget;
        this.advanceReceived = site.advance;
        this.payments = site.payments?.length
          ? site.payments.map(p => ({ ...p, date: this.toDateInput(p.date) }))
          : [{ date: null, amount: null, description: '' }];
        this.calculateRemaining();
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  /** `<input type="date">` only accepts `yyyy-MM-dd`; a Laravel date cast may carry a time part. */
  private toDateInput(value: string | null): string | null {
    return value ? value.substring(0, 10) : null;
  }

  selectType(type: SiteType): void {
    this.type = type;
    this.isTypeOpen = false;
  }

  selectStatus(status: SiteStatus): void {
    this.status = status;
    this.isStatusOpen = false;
  }

  calculateRemaining() {
    const budget = Number(this.totalBudget) || 0;
    const advance = Number(this.advanceReceived) || 0;
    const paid = this.getPaymentsTotal();
    this.remainingBalance = String(budget - advance - paid);
  }

  getPaymentsTotal(): number {
    return this.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }

  addPayment() {
    this.payments.push({ date: null, amount: null, description: '' });
  }

  removePayment(index: number) {
    this.payments.splice(index, 1);
    this.calculateRemaining();
  }

  save(): void {
    this.saving = true;
    this.error = '';

    const payload = {
      name: this.name,
      location: this.location,
      type: this.type,
      status: this.status,
      // Sent raw, not coerced to 0 — an empty field must fail validation, not save a silent zero.
      budget: this.totalBudget,
      advance: this.advanceReceived,
      // `remaining` is deliberately absent: the server recomputes it from budget/advance/payments.
      // The form always carries one blank row, so drop untouched rows before posting.
      payments: this.payments
        .filter(p => p.date || p.amount)
        .map(p => ({ date: p.date, amount: p.amount, description: p.description ?? null })),
    };

    const request = this.siteId
      ? this.api.update(`sites/${this.siteId}`, payload)
      : this.api.create('sites', payload);

    request.subscribe({
      next: () => this.router.navigate(['../site-list'], { relativeTo: this.route }),
      error: err => {
        this.error = err.message;
        this.saving = false;
      }
    });
  }
}
