import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-services-table',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './services-table.component.html',
  styleUrl: './services-table.component.css'
})
export class ServicesTableComponent implements OnInit {
  services: any[] = [];
  isLoading = false;
  message = '';

  constructor(private apiService: ApiService<any>) { }

  ngOnInit(): void { this.loadServices(); }

  loadServices() {
    this.isLoading = true;
    this.apiService.getAll('admin/services').subscribe({
      next: (res: any) => { this.services = res; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  deleteService(id: number) {
    if (!confirm('Delete this service?')) return;
    this.apiService.delete('admin/services', id).subscribe({
      next: () => { this.services = this.services.filter(s => s.id !== id); },
      error: (err: any) => { console.error(err); this.message = 'Delete failed.'; setTimeout(() => this.message = '', 3000); }
    });
  }
}
