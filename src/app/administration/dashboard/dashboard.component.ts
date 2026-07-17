import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { DashboardStats } from '../../models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = false;
  error = '';
  userName = '';

  constructor(private api: ApiService<DashboardStats>, private auth: AuthService) { }

  ngOnInit(): void {
    this.userName = this.auth.getUser()?.name ?? 'Admin';
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    this.error = '';

    // /dashboard answers with one object, not a collection — getById, not getAll.
    this.api.getById('dashboard').subscribe({
      next: stats => {
        this.stats = stats;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'color-warning';
      case 'Dispute': return 'color-danger';
      default: return '';
    }
  }
}
