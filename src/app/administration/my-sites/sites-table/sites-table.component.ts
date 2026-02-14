import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { Site } from '../../../models/site.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sites-table',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './sites-table.component.html',
  styleUrl: './sites-table.component.css'
})
export class SitesTableComponent implements OnInit {

  sites: Site[] = [];
  loading = true;
  searchQuery: string = '';

  constructor(private apiService: ApiService<Site>) { }

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites() {
    this.loading = true;
    this.apiService.getAll('admin/my-sites').subscribe({
      next: (data) => {
        this.sites = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching sites:', err);
        this.loading = false;
      }
    });
  }

  get filteredSites(): Site[] {
    if (!this.searchQuery) return this.sites;
    const lowerSearch = this.searchQuery.toLowerCase();
    return this.sites.filter(site =>
      site.name.toLowerCase().includes(lowerSearch) ||
      site.location.toLowerCase().includes(lowerSearch) ||
      site.status.toLowerCase().includes(lowerSearch) ||
      site.type.toLowerCase().includes(lowerSearch)
    );
  }

  deleteSite(id: number | undefined) {
    if (!id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete(`admin/my-sites/${id}`).subscribe({
          next: () => {
            this.sites = this.sites.filter(s => s.id !== id);
            Swal.fire(
              'Deleted!',
              'Your site has been deleted.',
              'success'
            );
          },
          error: (err) => {
            console.error('Error deleting site:', err);
            Swal.fire(
              'Error!',
              'Failed to delete site.',
              'error'
            );
          }
        });
      }
    });
  }
}

