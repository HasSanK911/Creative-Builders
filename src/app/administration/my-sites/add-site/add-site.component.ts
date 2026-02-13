import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-site',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.css'
})
export class AddSiteComponent implements AfterViewInit {

  constructor(private el: ElementRef) { }

  // --- Payment Properties ---
  totalBudget: number | null = null;
  advanceReceived: number | null = null;
  remainingBalance: string = '0';
  payments: any[] = [
    { date: null, amount: null, description: '' }
  ];

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
          selectBtn.setAttribute('data-type', option.getAttribute('data-type') || '');
          selectBtn.innerText = option.innerText;
        }
      });
    });
  }
}
