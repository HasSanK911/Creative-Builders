import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-testimonials-table',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './testimonials-table.component.html',
  styleUrl: './testimonials-table.component.css'
})
export class TestimonialsTableComponent implements OnInit {
  testimonials: any[] = [];
  isLoading = false;
  message = '';

  constructor(private apiService: ApiService<any>) { }

  ngOnInit(): void { this.loadTestimonials(); }

  loadTestimonials() {
    this.isLoading = true;
    this.apiService.getAll('admin/testimonials').subscribe({
      next: (res: any) => { this.testimonials = res; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  deleteTestimonial(id: number) {
    if (!confirm('Delete this testimonial?')) return;
    this.apiService.delete('admin/testimonials', id).subscribe({
      next: () => { this.testimonials = this.testimonials.filter(t => t.id !== id); },
      error: (err: any) => { console.error(err); this.message = 'Delete failed.'; setTimeout(() => this.message = '', 3000); }
    });
  }
}
