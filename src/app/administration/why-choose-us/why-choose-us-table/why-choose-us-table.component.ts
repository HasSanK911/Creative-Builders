import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../Services/api.service';

@Component({
    selector: 'app-why-choose-us-table',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './why-choose-us-table.component.html',
    styleUrl: './why-choose-us-table.component.css'
})
export class WhyChooseUsTableComponent implements OnInit {
    data: any = null;
    isLoading = false;
    message = '';

    constructor(private apiService: ApiService<any>) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;
        this.apiService.getById('admin/why-choose-us').subscribe({
            next: (res: any) => {
                // Ensure data structure is clean
                this.data = {
                    section_label: res.section_label || '',
                    heading: res.heading || '',
                    description: res.description || '',
                    image_url: res.image_url || '',
                    features: Array.isArray(res.features) ? res.features : []
                };
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error loading table data:', err);
                this.message = 'Failed to load content.';
                this.isLoading = false;
            }
        });
    }

    deleteFeature(index: number): void {
        if (!confirm('Are you sure you want to delete this feature?')) return;

        // Copy array and remove item
        const updatedFeatures = [...(this.data.features || [])];
        if (index >= 0 && index < updatedFeatures.length) {
            updatedFeatures.splice(index, 1);
        }

        const payload = {
            section_label: this.data.section_label,
            heading: this.data.heading,
            description: this.data.description,
            image_url: this.data.image_url,
            features: updatedFeatures
        };

        this.isLoading = true;
        this.apiService.create('admin/why-choose-us', payload).subscribe({
            next: (res: any) => {
                this.data.features = updatedFeatures;
                this.isLoading = false;
                this.message = 'Feature deleted successfully!';
                setTimeout(() => this.message = '', 3000);
            },
            error: (err: any) => {
                console.error('Delete feature failed:', err);
                this.message = 'Failed to delete feature. Please try again.';
                this.isLoading = false;
                setTimeout(() => this.message = '', 5000);
            }
        });
    }
}
