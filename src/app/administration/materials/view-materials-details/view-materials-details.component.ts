import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-materials-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-materials-details.component.html',
  styleUrl: './view-materials-details.component.css'
})
export class ViewMaterialsDetailsComponent implements OnInit {
  materialId: number = 0;
  materialName: string = '';
  materialUnit: string = '';

  filterSite: string = '';
  filterDateFrom: string = '';
  filterDateTo: string = '';
  isSiteDropdownOpen: boolean = false;

  sites: string[] = ['Rizwan Heights', "Ali's Home", "Lodhi's Arcade"];

  materialsMap: { [id: number]: { name: string; unit: string } } = {
    1: { name: 'Cement', unit: 'Bags' },
    2: { name: 'Steel', unit: 'Ton' },
    3: { name: 'Bricks', unit: 'Pieces' },
    4: { name: 'Sand', unit: 'Trolley' },
    5: { name: 'Bajri', unit: 'Trolley' },
    6: { name: 'Marble', unit: 'Sq Ft' },
    7: { name: 'Tiles', unit: 'Box' },
    8: { name: 'Paint', unit: 'Gallon' },
    9: { name: 'Electric Wire', unit: 'Roll' },
    10: { name: 'Electric Pipes', unit: 'Bundle' },
    11: { name: 'Sanitary Pipes', unit: 'Bundle' },
    12: { name: 'Aluminum', unit: 'Sq Ft' },
    13: { name: 'Plaster', unit: 'Bags' },
    14: { name: 'Steel Wire', unit: 'Kg' },
    15: { name: 'Chips', unit: 'Trolley' },
    16: { name: 'Fans', unit: 'Pieces' },
    17: { name: 'Lights etc', unit: 'Set' },
    18: { name: 'Door Lock', unit: 'Pieces' },
    19: { name: 'Geaser', unit: 'Pieces' },
    20: { name: 'Cameras', unit: 'Pieces' },
  };

  allRecords: { date: string; site: string; quantity: number; rate: number; total: number; supplier: string }[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.materialId = Number(this.route.snapshot.paramMap.get('id')) || 1;
    const info = this.materialsMap[this.materialId];
    this.materialName = info?.name || 'Unknown Material';
    this.materialUnit = info?.unit || '';
    this.generateSampleRecords();
  }

  generateSampleRecords() {
    const suppliers = ['Lucky Cement', 'Amreli Steel', 'Local Kiln', 'River Sand Co.', 'Crush Point', 'Marble Hub',
      'Master Tiles', 'Diamond Paints', 'Fast Cable', 'National Pipes'];
    const rates = [1150, 250000, 18, 18000, 22000, 120, 1800, 4500, 6500, 3200];
    const baseRate = rates[(this.materialId - 1) % rates.length];

    this.allRecords = [];
    for (let i = 0; i < 15; i++) {
      const site = this.sites[i % this.sites.length];
      const qty = Math.floor(Math.random() * 50) + 5;
      const rate = baseRate + Math.floor(Math.random() * 200) - 100;
      const month = String((i % 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      this.allRecords.push({
        date: `2025-${month}-${day}`,
        site,
        quantity: qty,
        rate,
        total: qty * rate,
        supplier: suppliers[(this.materialId - 1) % suppliers.length]
      });
    }
    this.allRecords.sort((a, b) => a.date.localeCompare(b.date));
  }

  get filteredRecords() {
    return this.allRecords.filter(r => {
      if (this.filterSite && r.site !== this.filterSite) return false;
      if (this.filterDateFrom && r.date < this.filterDateFrom) return false;
      if (this.filterDateTo && r.date > this.filterDateTo) return false;
      return true;
    });
  }

  get totalQuantity(): number {
    return this.filteredRecords.reduce((sum, r) => sum + r.quantity, 0);
  }

  get totalAmount(): number {
    return this.filteredRecords.reduce((sum, r) => sum + r.total, 0);
  }

  get averageRate(): number {
    const records = this.filteredRecords;
    if (records.length === 0) return 0;
    return Math.round(records.reduce((sum, r) => sum + r.rate, 0) / records.length);
  }

  applyFilters() {
    // Filters are applied reactively via the getter
  }

  selectSiteFilter(site: string) {
    this.filterSite = site;
    this.isSiteDropdownOpen = false;
  }

  clearFilters() {
    this.filterSite = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
  }

  downloadReport() {
    window.print();
  }
}
