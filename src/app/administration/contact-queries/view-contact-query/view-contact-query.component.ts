import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { ContactQuery } from '../../../models/api.models';

@Component({
  selector: 'app-view-contact-query',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-contact-query.component.html',
  styleUrl: './view-contact-query.component.css'
})
export class ViewContactQueryComponent implements OnInit {
  query: ContactQuery | null = null;

  loading = false;
  error: string | null = null;

  constructor(private api: ApiService<ContactQuery>, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'No query was requested.';
      return;
    }

    this.loading = true;

    this.api.getById(`contact-queries/${id}`).subscribe({
      next: query => {
        this.query = query;
        this.loading = false;

        // Opening a query is what "reading" it means — no separate button needed.
        if (!query.isRead) this.markRead(true);
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  markRead(isRead: boolean) {
    const query = this.query;
    if (!query) return;

    this.api.update(`contact-queries/${query.id}`, { isRead }).subscribe({
      next: () => query.isRead = isRead,
      error: err => this.error = err.message
    });
  }

  deleteQuery() {
    if (!this.query || !confirm('Are you sure you want to delete this query?')) return;

    this.api.delete(`contact-queries/${this.query.id}`).subscribe({
      next: () => this.router.navigate(['../../contact-queries-list'], { relativeTo: this.route }),
      error: err => this.error = err.message
    });
  }

  replyHref(): string {
    return `mailto:${this.query?.email}?subject=${encodeURIComponent('Re: your enquiry with Creative Builders')}`;
  }

  telHref(): string {
    return `tel:${(this.query?.phone ?? '').replace(/\s+/g, '')}`;
  }
}
