import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-add-services-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-services-detail.component.html',
  styleUrl: './add-services-detail.component.css'
})
export class AddServicesDetailComponent implements AfterViewInit, OnInit {

  isUploading: boolean = false;
  isSaving: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  isEditMode: boolean = false;
  serviceId: string | null = null;

  service: any = {
    title: '',
    description: '',
    hero_image_url: '',
    secondary_image_url: ''
  };

  private heroFile: File | null = null;
  private secondaryFile: File | null = null;

  constructor(
    private el: ElementRef,
    private apiService: ApiService<any>,
    private router: Router,
    private route: ActivatedRoute
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
        // Update previews
        setTimeout(() => {
          this.updatePreview('#heroPreviewImage', '#heroPlaceholderText', res.hero_image_url);
          this.updatePreview('#secondaryPreviewImage', '#secondaryPlaceholderText', res.secondary_image_url);
        }, 100);
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Error loading service details.';
        this.isLoading = false;
      }
    });
  }

  private updatePreview(imgSelector: string, textSelector: string, url: string | null) {
    if (!url) return;
    const previewImage = this.el.nativeElement.querySelector(imgSelector);
    const placeholderText = this.el.nativeElement.querySelector(textSelector);
    if (previewImage) {
      previewImage.src = url;
      previewImage.style.display = 'block';
    }
    if (placeholderText) {
      placeholderText.style.display = 'none';
    }
  }

  ngAfterViewInit(): void {
    this.initHeroImageUpload();
    this.initSecondaryImageUpload();
  }

  saveService() {
    this.isSaving = true;

    const doSave = () => {
      const request = this.isEditMode
        ? this.apiService.update(`admin/services/${this.serviceId}`, this.service)
        : this.apiService.create('admin/services', this.service);

      request.subscribe({
        next: () => {
          this.message = this.isEditMode ? 'Service details updated successfully!' : 'Service saved successfully!';
          this.isSaving = false;
          setTimeout(() => {
            this.message = '';
            this.router.navigate(['/admin/service-list']);
          }, 1500);
        },
        error: (err: any) => {
          console.error('Service save failed', err);
          this.message = 'Failed to save service.';
          this.isSaving = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    };

    // Upload hero and secondary images if selected
    const uploads: Promise<void>[] = [];

    if (this.heroFile) {
      uploads.push(
        lastValueFrom(this.apiService.uploadImage(this.heroFile, 'services')).then((res: any) => {
          this.service.hero_image_url = res.url;
          this.heroFile = null;
        })
      );
    }
    if (this.secondaryFile) {
      uploads.push(
        lastValueFrom(this.apiService.uploadImage(this.secondaryFile, 'services')).then((res: any) => {
          this.service.secondary_image_url = res.url;
          this.secondaryFile = null;
        })
      );
    }

    if (uploads.length > 0) {
      this.isUploading = true;
      Promise.all(uploads).then(() => {
        this.isUploading = false;
        doSave();
      }).catch(err => {
        console.error('Image upload failed', err);
        this.message = 'Image upload failed.';
        this.isSaving = false;
        this.isUploading = false;
        setTimeout(() => this.message = '', 3000);
      });
    } else {
      doSave();
    }
  }

  private initHeroImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#heroUploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#heroFileInput');
    const previewImage = this.el.nativeElement.querySelector('#heroPreviewImage');
    const placeholderText = this.el.nativeElement.querySelector('#heroPlaceholderText');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', (e: Event) => { e.preventDefault(); fileInput.click(); });
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          this.heroFile = file;
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

  private initSecondaryImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#secondaryUploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#secondaryFileInput');
    const previewImage = this.el.nativeElement.querySelector('#secondaryPreviewImage');
    const placeholderText = this.el.nativeElement.querySelector('#secondaryPlaceholderText');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', (e: Event) => { e.preventDefault(); fileInput.click(); });
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          this.secondaryFile = file;
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
