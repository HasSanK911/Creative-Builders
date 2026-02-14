import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SiteInfo {
  name: string;
  blockNo: string;
  streetNo: string;
  houseNo: string;
  status: 'Completed' | 'Pending' | 'Dispute';
}

@Component({
  selector: 'app-site-info-table',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './site-info-table.component.html',
  styleUrl: './site-info-table.component.css'
})
export class SiteInfoTableComponent {
  searchText: string = '';
  filterStatus: string = 'All';
  isDropdownOpen: boolean = false;

  siteInfos: SiteInfo[] = [
    { name: 'Rizwan Heights', blockNo: 'A', streetNo: '1', houseNo: '1', status: 'Completed' },
    { name: "Ali's Home", blockNo: 'B', streetNo: '2', houseNo: '2', status: 'Pending' },
    { name: "Lodhi's Arcade", blockNo: 'C', streetNo: '3', houseNo: '3', status: 'Dispute' }
  ];

  get filteredSiteInfos(): SiteInfo[] {
    return this.siteInfos.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(this.searchText.toLowerCase());
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
