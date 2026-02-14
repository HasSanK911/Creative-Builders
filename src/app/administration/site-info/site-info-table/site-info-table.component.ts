import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ApiService } from '../../../Services/api.service';
import { SiteInfo } from '../../../models/site-info.model';

@Component({
  selector: 'app-site-info-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './site-info-table.component.html',
  styleUrl: './site-info-table.component.css'
})
export class SiteInfoTableComponent implements OnInit {
  siteInfos: SiteInfo[] = [];
  filteredSiteInfos: SiteInfo[] = [];
  searchQuery: string = '';

  constructor(
    private apiService: ApiService<any>,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSiteInfos();
  }

  loadSiteInfos() {
    this.apiService.getAll('admin/site-info').subscribe({
      next: (data: SiteInfo[]) => {
        this.siteInfos = data;
        this.filterSiteInfos();
      },
      error: (err) => {
        console.error('Error loading site infos:', err);
        this.toastr.error('Failed to load site information.', 'Error');
      }
    });
  }

  filterSiteInfos() {
    if (!this.searchQuery) {
      this.filteredSiteInfos = this.siteInfos;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredSiteInfos = this.siteInfos.filter(info =>
        (info.site_name?.toLowerCase().includes(query) || '') ||
        (info.block_no?.toLowerCase().includes(query) || '') ||
        (info.street_no?.toLowerCase().includes(query) || '') ||
        (info.house_no?.toLowerCase().includes(query) || '')
      );
    }
  }

  deleteSiteInfo(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this site information!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.value) {
        this.apiService.delete(`admin/site-info/${id}`).subscribe({
          next: () => {
            this.siteInfos = this.siteInfos.filter(s => s.id !== id);
            this.filterSiteInfos();
            this.toastr.success('Site info deleted successfully.', 'Deleted');
          },
          error: (err) => {
            console.error('Error deleting site info:', err);
            this.toastr.error('Failed to delete site info.', 'Error');
          }
        });
      }
    });
  }
}
