import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Testimonial } from '../../../models/api.models';

@Component({
  selector: 'app-testimonials-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './testimonials-table.component.html',
  styleUrl: './testimonials-table.component.css'
})
export class TestimonialsTableComponent implements OnInit {

  testimonials: Testimonial[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private api: ApiService<Testimonial>) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.api.getAll('testimonials').subscribe({
      next: rows => {
        this.testimonials = rows;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  stars(rating: number): string {
    const count = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return '⭐'.repeat(count);
  }

  remove(testimonial: Testimonial): void {
    if (!confirm(`Delete the testimonial from ${testimonial.clientName}?`)) {
      return;
    }

    this.api.delete(`testimonials/${testimonial.id}`).subscribe({
      next: () => this.load(),
      error: err => this.error = err.message
    });
  }
}
