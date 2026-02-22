import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../../../Services/api.service';

@Component({
    selector: 'app-edit-gallery-item',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './edit-gallery-item.component.html',
    styleUrl: './edit-gallery-item.component.css'
})
export class EditGalleryItemComponent implements OnInit {

    galleryId!: number;
    batch: any = null;
    existingImages: string[] = [];   // Cloudinary URLs already saved
    newFiles: File[] = [];           // New files selected but not yet uploaded
    newPreviews: string[] = [];      // Data-URL previews for new files
    sites: any[] = [];
    selectedSiteId: number | null = null;
    isSaving = false;
    message = '';

    constructor(
        private apiService: ApiService<any>,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.galleryId = +this.route.snapshot.params['id'];
        this.loadData();
    }

    loadData() {
        this.apiService.getAll('admin/gallery').subscribe({
            next: (galleries: any[]) => {
                this.batch = galleries.find(g => g.id === this.galleryId);
                if (this.batch) {
                    this.existingImages = [...(this.batch.images || [])];
                    this.selectedSiteId = this.batch.site_id || null;
                }
            },
            error: () => { this.message = 'Failed to load gallery.'; }
        });
        this.apiService.getAll('admin/my-sites').subscribe({
            next: (sites: any[]) => { this.sites = sites; },
            error: (err: any) => { console.error('Sites load error:', err); }
        });
    }

    onFilesSelected(event: any) {
        const files: File[] = Array.from(event.target.files || []);
        files.forEach(file => {
            if (!this.newFiles.some(f => f.name === file.name && f.size === file.size)) {
                this.newFiles.push(file);
                const reader = new FileReader();
                reader.onload = (e: any) => this.newPreviews.push(e.target.result);
                reader.readAsDataURL(file);
            }
        });
        event.target.value = '';
    }

    removeExisting(index: number) {
        this.existingImages.splice(index, 1);
    }

    removeNew(index: number) {
        this.newFiles.splice(index, 1);
        this.newPreviews.splice(index, 1);
    }

    async save() {
        this.isSaving = true;
        try {
            let newUrls: string[] = [];
            if (this.newFiles.length > 0) {
                const results = await Promise.all(
                    this.newFiles.map(file => lastValueFrom(this.apiService.uploadImage(file, 'gallery')))
                );
                newUrls = (results as any[]).map(r => r.url);
            }
            const allImages = [...this.existingImages, ...newUrls];
            await lastValueFrom(
                this.apiService.update(`admin/gallery/${this.galleryId}`, {
                    site_id: this.selectedSiteId,
                    images: allImages
                })
            );
            this.message = 'Gallery updated successfully!';
            this.isSaving = false;
            setTimeout(() => this.router.navigate(['/admin/gallery-item-list']), 1200);
        } catch (err: any) {
            this.message = `Update failed: ${err?.message || 'Server error'}`;
            this.isSaving = false;
        }
    }
}
