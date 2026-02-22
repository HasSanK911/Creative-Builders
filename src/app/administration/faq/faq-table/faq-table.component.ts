import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-faq-table',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './faq-table.component.html',
  styleUrl: './faq-table.component.css'
})
export class FaqTableComponent implements OnInit {
  faqs: any[] = [];
  isLoading = false;
  message = '';

  constructor(private apiService: ApiService<any>) { }

  ngOnInit(): void { this.loadFaqs(); }

  loadFaqs() {
    this.isLoading = true;
    this.apiService.getAll('admin/faqs').subscribe({
      next: (res: any) => { this.faqs = res; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  deleteFaq(id: number) {
    if (!confirm('Delete this FAQ?')) return;
    this.apiService.delete('admin/faqs', id).subscribe({
      next: () => { this.faqs = this.faqs.filter(f => f.id !== id); },
      error: (err: any) => { console.error(err); this.message = 'Delete failed.'; setTimeout(() => this.message = '', 3000); }
    });
  }
}
