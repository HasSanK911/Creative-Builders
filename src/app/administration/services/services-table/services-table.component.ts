import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Service } from '../../../models/api.models';

@Component({
  selector: 'app-services-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-table.component.html',
  styleUrl: './services-table.component.css'
})
export class ServicesTableComponent implements OnInit {
  services: Service[] = [];

  loading = false;
  error: string | null = null;

  constructor(private api: ApiService<Service>) { }

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.error = null;

    this.api.getAll('services').subscribe({
      next: services => {
        this.services = services;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  deleteService(id: number) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    this.api.delete(`services/${id}`).subscribe({
      next: () => this.loadServices(),
      error: err => this.error = err.message
    });
  }
}
