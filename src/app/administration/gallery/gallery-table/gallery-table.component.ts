import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-gallery-table',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './gallery-table.component.html',
  styleUrl: './gallery-table.component.css'
})
export class GalleryTableComponent implements OnInit {
  galleries: any[] = [];
  isLoading = false;
  message = '';
  previewUrl: string | null = null;

  constructor(private apiService: ApiService<any>) { }

  ngOnInit(): void { this.loadGallery(); }

  loadGallery() {
    this.isLoading = true;
    this.apiService.getAll('admin/gallery').subscribe({
      next: (res: any) => { this.galleries = res; this.isLoading = false; },
      error: (err: any) => {
        console.error('Gallery load error:', err);
        this.message = `Failed to load gallery: ${err?.message || 'Server error'}`;
        this.isLoading = false;
      }
    });
  }

  openPreview(url: string) { this.previewUrl = url; }
  closePreview() { this.previewUrl = null; }

  deleteGallery(id: number) {
    if (!confirm('Delete this gallery batch?')) return;
    this.apiService.delete('admin/gallery', id).subscribe({
      next: () => { this.galleries = this.galleries.filter(g => g.id !== id); },
      error: (err: any) => { console.error(err); this.message = 'Delete failed.'; setTimeout(() => this.message = '', 3000); }
    });
  }
}
