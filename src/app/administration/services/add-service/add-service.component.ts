import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.css'
})
export class AddServiceComponent implements OnInit {
  service: any = { title: '', description: '' };
  isSaving = false;
  isLoading = false;
  message = '';
  isEditMode = false;
  serviceId: string | null = null;

  constructor(
    private apiService: ApiService<any>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (this.serviceId) {
      this.isEditMode = true;
      this.fetchService();
    }
  }

  fetchService() {
    this.isLoading = true;
    this.apiService.getById(`admin/services/${this.serviceId}`).subscribe({
      next: (res: any) => {
        this.service = res;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Error loading service details.';
        this.isLoading = false;
      }
    });
  }

  saveService() {
    if (!this.service.title) {
      this.message = 'Please enter a service title.';
      setTimeout(() => this.message = '', 3000);
      return;
    }
    this.isSaving = true;

    const request = this.isEditMode
      ? this.apiService.update(`admin/services/${this.serviceId}`, this.service)
      : this.apiService.create('admin/services', this.service);

    request.subscribe({
      next: () => {
        this.message = this.isEditMode ? 'Service updated successfully!' : 'Service saved successfully!';
        this.isSaving = false;
        setTimeout(() => {
          this.message = '';
          this.router.navigate(['/admin/service-list']);
        }, 2000);
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Failed to save service.';
        this.isSaving = false;
        setTimeout(() => this.message = '', 3000);
      }
    });
  }
}
