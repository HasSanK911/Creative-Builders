import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { SiteInfo } from '../../../models/api.models';

@Component({
  selector: 'app-site-info-table',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './site-info-table.component.html',
  styleUrl: './site-info-table.component.css'
})
export class SiteInfoTableComponent implements OnInit {
  searchText: string = '';
  filterStatus: string = 'All';
  isDropdownOpen: boolean = false;

  // The list endpoint returns header rows only — items/attendance/receipts are not loaded here.
  siteInfos: SiteInfo[] = [];

  loading = false;
  error: string | null = null;

  constructor(private api: ApiService<SiteInfo>) { }

  ngOnInit() {
    this.loadSiteInfos();
  }

  loadSiteInfos() {
    this.loading = true;
    this.error = null;

    this.api.getAll('site-infos').subscribe({
      next: siteInfos => {
        this.siteInfos = siteInfos;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  get filteredSiteInfos(): SiteInfo[] {
    const query = this.searchText.trim().toLowerCase();

    return this.siteInfos.filter(site => {
      const matchesSearch = !query || (site.siteName ?? '').toLowerCase().includes(query);
      const matchesFilter = this.filterStatus === 'All' || site.status === this.filterStatus;

      return matchesSearch && matchesFilter;
    });
  }

  get filterStatusVal(): string {
    return this.filterStatus === 'All' ? 'All Status' : this.filterStatus;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectStatus(status: string) {
    this.filterStatus = status;
    this.isDropdownOpen = false;
  }

  deleteSiteInfo(site: SiteInfo) {
    if (!confirm(`Delete the site information sheet for "${site.siteName}"? This also removes its items, attendance and receipts.`)) {
      return;
    }

    this.api.delete(`site-infos/${site.id}`).subscribe({
      next: () => this.loadSiteInfos(),
      error: err => this.error = err.message
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
