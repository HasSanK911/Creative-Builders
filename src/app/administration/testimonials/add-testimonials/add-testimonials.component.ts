import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-add-testimonials',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-testimonials.component.html',
  styleUrl: './add-testimonials.component.css'
})
export class AddTestimonialsComponent implements AfterViewInit, OnInit {
  testimonial: any = { client_name: '', designation: '', feedback: '', rating: '', image_url: '' };
  isUploading = false;
  isSaving = false;
  isLoading = false;
  message = '';
  isEditMode = false;
  testimonialId: string | null = null;
  private imageFile: File | null = null;

  constructor(
    private el: ElementRef,
    private apiService: ApiService<any>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.testimonialId = this.route.snapshot.paramMap.get('id');
    if (this.testimonialId) {
      this.isEditMode = true;
      this.fetchTestimonial();
    }
  }

  fetchTestimonial() {
    this.isLoading = true;
    this.apiService.getById(`admin/testimonials/${this.testimonialId}`).subscribe({
      next: (res: any) => {
        this.testimonial = res;
        this.isLoading = false;
        if (res.image_url) {
          setTimeout(() => this.updateImagePreview(res.image_url), 100);
        }
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Error loading testimonial details.';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.initClientImageUpload();
  }

  private updateImagePreview(url: string | null): void {
    if (!url) return;
    const previewImage = this.el.nativeElement.querySelector('#clientPreviewImage');
    const placeholderText = this.el.nativeElement.querySelector('#clientPlaceholderText');
    if (previewImage) {
      previewImage.src = url;
      previewImage.style.display = 'block';
    }
    if (placeholderText) {
      placeholderText.style.display = 'none';
    }
  }

  saveTestimonial() {
    if (!this.testimonial.client_name || !this.testimonial.feedback) {
      this.message = 'Please fill in client name and feedback.';
      setTimeout(() => this.message = '', 3000);
      return;
    }
    this.isSaving = true;

    const doSave = () => {
      const request = this.isEditMode
        ? this.apiService.update(`admin/testimonials/${this.testimonialId}`, this.testimonial)
        : this.apiService.create('admin/testimonials', this.testimonial);

      request.subscribe({
        next: () => {
          this.message = this.isEditMode ? 'Testimonial updated successfully!' : 'Testimonial saved successfully!';
          this.isSaving = false;
          setTimeout(() => {
            this.message = '';
            this.router.navigate(['/admin/testimonials-list']);
          }, 2000);
        },
        error: (err: any) => {
          console.error(err);
          this.message = 'Failed to save testimonial.';
          this.isSaving = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    };

    if (this.imageFile) {
      this.isUploading = true;
      this.apiService.uploadImage(this.imageFile, 'testimonials').subscribe({
        next: (res) => {
          this.testimonial.image_url = res.url;
          this.imageFile = null;
          this.isUploading = false;
          doSave();
        },
        error: () => {
          this.message = 'Image upload failed.';
          this.isSaving = false;
          this.isUploading = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    } else {
      doSave();
    }
  }

  private initClientImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#clientUploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#clientFileInput');
    const previewImage = this.el.nativeElement.querySelector('#clientPreviewImage');
    const placeholderText = this.el.nativeElement.querySelector('#clientPlaceholderText');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', (e: Event) => { e.preventDefault(); fileInput.click(); });
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          this.imageFile = file;
          const reader = new FileReader();
          reader.onload = (e: any) => {
            if (previewImage) { previewImage.src = e.target.result; previewImage.style.display = 'block'; }
            if (placeholderText) placeholderText.style.display = 'none';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
}
