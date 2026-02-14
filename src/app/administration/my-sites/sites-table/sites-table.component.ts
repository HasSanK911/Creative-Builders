import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Site {
  name: string;
  type: string;
  location: string;
  budget: number;
  advance: number;
  remaining: number;
  status: 'Completed' | 'Pending' | 'Dispute';
}

@Component({
  selector: 'app-sites-table',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './sites-table.component.html',
  styleUrl: './sites-table.component.css'
})
export class SitesTableComponent {
  searchText: string = '';
  filterStatus: string = 'All';
  isDropdownOpen: boolean = false;

  sites: Site[] = [
    {
      name: 'Rizwan Heights',
      type: 'Building',
      location: 'B Block , Citi Housing',
      budget: 5000000,
      advance: 1500000,
      remaining: 3500000,
      status: 'Completed'
    },
    {
      name: "Ali's Home",
      type: 'Home',
      location: 'D Block , Citi Housing',
      budget: 3200000,
      advance: 800000,
      remaining: 2400000,
      status: 'Pending'
    },
    {
      name: "Lodhi's Arcade",
      type: 'Building',
      location: 'E Block , Citi Housing',
      budget: 8500000,
      advance: 2000000,
      remaining: 6500000,
      status: 'Dispute'
    }
  ];

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
