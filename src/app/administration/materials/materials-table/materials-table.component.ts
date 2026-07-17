import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Material } from '../../../models/api.models';

@Component({
  selector: 'app-materials-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './materials-table.component.html',
  styleUrl: './materials-table.component.css'
})
export class MaterialsTableComponent implements OnInit {
  searchQuery: string = '';

  materials: Material[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private api: ApiService<Material>) { }

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.loading = true;
    this.error = '';

    this.api.getAll('materials').subscribe({
      next: materials => {
        this.materials = materials;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.materials = [];
        this.loading = false;
      }
    });
  }

  // The catalogue is small and fetched whole, so the search stays client-side.
  get filteredMaterials(): Material[] {
    if (!this.searchQuery.trim()) {
      return this.materials;
    }
    const query = this.searchQuery.toLowerCase();
    return this.materials.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.unit.toLowerCase().includes(query)
    );
  }

  downloadReport() {
    window.print();
  }
}
