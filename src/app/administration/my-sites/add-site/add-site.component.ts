import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Site } from '../../../models/site.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-site',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.css'
})
export class AddSiteComponent implements AfterViewInit, OnInit {

  constructor(
    private el: ElementRef,
    private apiService: ApiService<Site>,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  // --- Site Properties ---
  siteName: string = '';
  location: string = '';
  siteType: string = 'Residential'; // Default or based on select
  status: string = 'Ongoing'; // Default or based on select

  // --- Payment Properties ---
  totalBudget: number | null = null;
  advanceReceived: number | null = null;
  remainingBalance: string = '0';
  payments: any[] = [
    { date: null, amount: null, description: '' }
  ];

  isSubmitting = false;
  isEditMode = false;
  siteId: number | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.siteId = +params['id'];
        this.loadSiteData(this.siteId);
      }
    });
  }

  loadSiteData(id: number) {
    this.apiService.getById(`admin/my-sites/${id}`).subscribe({
      next: (site: Site) => {
        this.siteName = site.name;
        this.location = site.location;
        this.siteType = site.type;
        this.status = site.status;
        this.totalBudget = site.total_budget;
        this.advanceReceived = site.advance_received;
        this.payments = site.payments && site.payments.length > 0 ? site.payments : [{ date: null, amount: null, description: '' }];

        // Update custom selects if needed (might need timeout to wait for view)
        setTimeout(() => this.updateCustomSelects(), 100);
        this.calculateRemaining();
      },
      error: (err) => {
        this.toastr.error('Failed to load site data.', 'Error');
        this.router.navigate(['/admin/my-sites']);
      }
    });
  }

  updateCustomSelects() {
    // Logic to update UI of custom selects based on loaded data
    // This assumes the custom select logic relies on DOM elements
    const typeOption = Array.from(this.el.nativeElement.querySelectorAll('.option'))
      .find((opt: any) => opt.innerText.trim() === this.siteType) as HTMLElement;
    if (typeOption) {
      const selectBtn = typeOption.closest('.select')?.children[0] as HTMLElement;
      if (selectBtn) selectBtn.innerText = this.siteType;
    }

    const statusOption = Array.from(this.el.nativeElement.querySelectorAll('.option'))
      .find((opt: any) => opt.innerText.trim() === this.status) as HTMLElement;
    if (statusOption) {
      const selectBtn = statusOption.closest('.select')?.children[0] as HTMLElement;
      if (selectBtn) selectBtn.innerText = this.status;
    }
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

  saveSite() {
    if (!this.siteName || !this.location || !this.totalBudget) {
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
      return;
    }

    const totalStats = Number(this.advanceReceived) + this.getPaymentsTotal();
    if (totalStats > Number(this.totalBudget)) {
      this.toastr.error('Total payments (Advance + Installments) cannot exceed Total Budget.', 'Validation Error');
      return;
    }

    this.isSubmitting = true;

    const siteData: Site = {
      name: this.siteName,
      location: this.location,
      type: this.siteType,
      status: this.status,
      total_budget: Number(this.totalBudget),
      advance_received: Number(this.advanceReceived) || 0,
      payments: this.payments.filter(p => p.amount && p.date)
    };

    if (this.isEditMode && this.siteId) {
      this.apiService.update(`admin/my-sites/${this.siteId}`, siteData).subscribe({
        next: () => {
          this.toastr.success('Site updated successfully!', 'Success');
          this.isSubmitting = false;
          this.router.navigate(['/admin/my-sites']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(err.message || 'Failed to update site.', 'Error');
          this.isSubmitting = false;
        }
      });
    } else {
      this.apiService.create('admin/my-sites', siteData).subscribe({
        next: () => {
          this.toastr.success('Site created successfully!', 'Success');
          this.isSubmitting = false;
          this.router.navigate(['/admin/my-sites']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(err.message || 'Failed to create site.', 'Error');
          this.isSubmitting = false;
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.initCustomSelects();
  }

  private initCustomSelects(): void {
    let zIndex = 1;

    // Toggle dropdown on selectBtn click
    const selectBtns = this.el.nativeElement.querySelectorAll('.selectBtn');
    selectBtns.forEach((btn: HTMLElement) => {
      btn.addEventListener('click', () => {
        const dropdown = btn.nextElementSibling as HTMLElement;
        if (dropdown) {
          dropdown.classList.toggle('toggle');
          dropdown.style.zIndex = String(zIndex++);
        }
      });
    });

    // Select option on click
    const options = this.el.nativeElement.querySelectorAll('.option');
    options.forEach((option: HTMLElement) => {
      option.addEventListener('click', () => {
        const dropdown = option.parentElement as HTMLElement;
        dropdown.classList.remove('toggle');

        const selectBtn = option.closest('.select')?.children[0] as HTMLElement;
        if (selectBtn) {
          const type = option.getAttribute('data-type');
          selectBtn.setAttribute('data-type', type || '');
          selectBtn.innerText = option.innerText;

          // Update component property based on the select
          // Assuming the first select is 'Type' and second is 'Status' based on order or class
          // A more robust way would be to check the parent's ID or class
          // For now, let's look at the options text or data-type if available

          if (['Residential', 'Commercial', 'Industrial'].includes(option.innerText)) {
            this.siteType = option.innerText;
          } else if (['Ongoing', 'Completed', 'On Hold'].includes(option.innerText)) {
            this.status = option.innerText;
          }

        }
      });
    });
  }
}
