import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-banner-table',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './banner-table.component.html',
  styleUrl: './banner-table.component.css'
})
export class BannerTableComponent implements OnInit {
  banners: any[] = [];
  isLoading = false;
  message = '';

  constructor(private apiService: ApiService<any>) { }

  ngOnInit(): void { this.loadBanners(); }

  loadBanners() {
    this.isLoading = true;
    this.apiService.getAll('admin/banners').subscribe({
      next: (res: any) => { this.banners = res; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  deleteBanner(id: number) {
    if (!confirm('Delete this banner?')) return;
    this.apiService.delete('admin/banners', id).subscribe({
      next: () => { this.banners = this.banners.filter(b => b.id !== id); },
      error: (err: any) => { console.error(err); this.message = 'Delete failed.'; setTimeout(() => this.message = '', 3000); }
    });
  }
}
