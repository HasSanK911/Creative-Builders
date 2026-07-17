import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { GalleryItem } from '../../../models/api.models';

@Component({
  selector: 'app-gallery-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery-table.component.html',
  styleUrl: './gallery-table.component.css'
})
export class GalleryTableComponent implements OnInit {

  items: GalleryItem[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private api: ApiService<GalleryItem>) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.api.getAll('gallery').subscribe({
      next: rows => {
        this.items = rows;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  remove(item: GalleryItem): void {
    const label = item.title || `#${item.id}`;
    if (!confirm(`Delete gallery image ${label}?`)) {
      return;
    }

    this.api.delete(`gallery/${item.id}`).subscribe({
      next: () => this.load(),
      error: err => this.error = err.message
    });
  }
}
