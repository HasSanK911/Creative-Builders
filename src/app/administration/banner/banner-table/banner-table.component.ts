import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Banner } from '../../../models/api.models';

@Component({
  selector: 'app-banner-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './banner-table.component.html',
  styleUrls: ['./banner-table.component.css']
})
export class BannerTableComponent implements OnInit {
  banners: Banner[] = [];

  loading = false;
  error: string | null = null;

  constructor(private api: ApiService<Banner>) { }

  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    this.loading = true;
    this.error = null;

    this.api.getAll('banners').subscribe({
      next: banners => {
        this.banners = banners;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  deleteBanner(id: number) {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    this.api.delete(`banners/${id}`).subscribe({
      next: () => this.loadBanners(),
      error: err => this.error = err.message
    });
  }
}
