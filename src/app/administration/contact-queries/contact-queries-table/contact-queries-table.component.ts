import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { ContactQuery } from '../../../models/api.models';

@Component({
  selector: 'app-contact-queries-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact-queries-table.component.html',
  styleUrl: './contact-queries-table.component.css'
})
export class ContactQueriesTableComponent implements OnInit {
  queries: ContactQuery[] = [];

  /** When on, the table hides everything that has already been read. */
  unreadOnly = false;

  loading = false;
  error: string | null = null;

  constructor(private api: ApiService<ContactQuery>) { }

  ngOnInit() {
    this.loadQueries();
  }

  loadQueries() {
    this.loading = true;
    this.error = null;

    this.api.getAll('contact-queries').subscribe({
      next: queries => {
        this.queries = queries;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  visibleQueries(): ContactQuery[] {
    return this.unreadOnly ? this.queries.filter(query => !query.isRead) : this.queries;
  }

  unreadCount(): number {
    return this.queries.filter(query => !query.isRead).length;
  }

  toggleRead(query: ContactQuery) {
    const isRead = !query.isRead;

    this.api.update(`contact-queries/${query.id}`, { isRead }).subscribe({
      next: () => query.isRead = isRead,
      error: err => this.error = err.message
    });
  }

  deleteQuery(id: number) {
    if (!confirm('Are you sure you want to delete this query?')) return;

    this.api.delete(`contact-queries/${id}`).subscribe({
      next: () => this.loadQueries(),
      error: err => this.error = err.message
    });
  }
}
