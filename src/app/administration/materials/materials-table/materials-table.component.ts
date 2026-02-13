import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-materials-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './materials-table.component.html',
  styleUrl: './materials-table.component.css'
})
export class MaterialsTableComponent {
  searchQuery: string = '';

  materials = [
    { id: 1, name: 'Cement', unit: 'Bags', rate: 1150, stock: 200 },
    { id: 2, name: 'Steel', unit: 'Ton', rate: 250000, stock: 15 },
    { id: 3, name: 'Bricks', unit: 'Pieces', rate: 18, stock: 50000 },
    { id: 4, name: 'Sand', unit: 'Trolley', rate: 18000, stock: 30 },
    { id: 5, name: 'Bajri', unit: 'Trolley', rate: 22000, stock: 25 },
    { id: 6, name: 'Marble', unit: 'Sq Ft', rate: 120, stock: 5000 },
    { id: 7, name: 'Tiles', unit: 'Box', rate: 1800, stock: 300 },
    { id: 8, name: 'Paint', unit: 'Gallon', rate: 4500, stock: 50 },
    { id: 9, name: 'Electric Wire', unit: 'Roll', rate: 6500, stock: 40 },
    { id: 10, name: 'Electric Pipes', unit: 'Bundle', rate: 3200, stock: 60 },
    { id: 11, name: 'Sanitary Pipes', unit: 'Bundle', rate: 4500, stock: 35 },
    { id: 12, name: 'Aluminum', unit: 'Sq Ft', rate: 550, stock: 1500 },
    { id: 13, name: 'Plaster', unit: 'Bags', rate: 450, stock: 100 },
    { id: 14, name: 'Steel Wire', unit: 'Kg', rate: 280, stock: 500 },
    { id: 15, name: 'Chips', unit: 'Trolley', rate: 15000, stock: 20 },
    { id: 16, name: 'Fans', unit: 'Pieces', rate: 7500, stock: 30 },
    { id: 17, name: 'Lights etc', unit: 'Set', rate: 2500, stock: 80 },
    { id: 18, name: 'Door Lock', unit: 'Pieces', rate: 3500, stock: 25 },
    { id: 19, name: 'Geaser', unit: 'Pieces', rate: 18000, stock: 5 },
    { id: 20, name: 'Cameras', unit: 'Pieces', rate: 8500, stock: 12 },
  ];

  get filteredMaterials() {
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
