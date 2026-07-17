import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { Site } from '../../../models/api.models';

@Component({
  selector: 'app-sites-table',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './sites-table.component.html',
  styleUrl: './sites-table.component.css'
})
export class SitesTableComponent implements OnInit {
  searchText: string = '';
  filterStatus: string = 'All';
  isDropdownOpen: boolean = false;

  sites: Site[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService<Site>) { }

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.loading = true;
    this.error = '';

    this.api.getAll('sites').subscribe({
      next: rows => {
        this.sites = rows;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  deleteSite(site: Site): void {
    if (!confirm(`Delete "${site.name}"? Its payments will be removed too.`)) {
      return;
    }

    this.api.delete(`sites/${site.id}`).subscribe({
      next: () => this.loadSites(),
      error: err => this.error = err.message
    });
  }

  get filteredSites(): Site[] {
    return this.sites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        site.location.toLowerCase().includes(this.searchText.toLowerCase());
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'color-warning';
      case 'Dispute': return 'color-danger';
      default: return '';
    }
  }
}
