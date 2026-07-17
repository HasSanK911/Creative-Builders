import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Faq } from '../../../models/api.models';

@Component({
  selector: 'app-faq-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq-table.component.html',
  styleUrl: './faq-table.component.css'
})
export class FaqTableComponent implements OnInit {
  faqs: Faq[] = [];

  loading = false;
  error: string | null = null;

  constructor(private api: ApiService<Faq>) { }

  ngOnInit() {
    this.loadFaqs();
  }

  loadFaqs() {
    this.loading = true;
    this.error = null;

    this.api.getAll('faqs').subscribe({
      next: faqs => {
        this.faqs = faqs;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  deleteFaq(id: number) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    this.api.delete(`faqs/${id}`).subscribe({
      next: () => this.loadFaqs(),
      error: err => this.error = err.message
    });
  }
}
