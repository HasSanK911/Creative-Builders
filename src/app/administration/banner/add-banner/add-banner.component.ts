import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-add-banner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.css']
})
export class AddBannerComponent implements OnInit {
  selectedImage: string | ArrayBuffer | null = null;
  isUploading: boolean = false;
  isSaving: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  isEditMode: boolean = false;
  bannerId: string | null = null;

  bannerData: any = {
    tagline: '',
    heading: '',
    description: '',
    image_url: ''
  };

  private selectedFile: File | null = null;

  constructor(
    private apiService: ApiService<any>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bannerId = this.route.snapshot.paramMap.get('id');
    if (this.bannerId) {
      this.isEditMode = true;
      this.fetchBanner();
    }
  }

  fetchBanner() {
    this.isLoading = true;
    this.apiService.getById(`admin/banners/${this.bannerId}`).subscribe({
      next: (res: any) => {
        this.bannerData = res;
        this.selectedImage = res.image_url;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Error loading banner details.';
        this.isLoading = false;
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Local preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveBanner() {
    if (!this.bannerData.heading || !this.bannerData.description) {
      this.message = 'Please fill in all required fields.';
      setTimeout(() => this.message = '', 3000);
      return;
    }

    this.isSaving = true;

    const doSave = () => {
      const request = this.isEditMode
        ? this.apiService.update(`admin/banners/${this.bannerId}`, this.bannerData)
        : this.apiService.create('admin/banners', this.bannerData);

      request.subscribe({
        next: () => {
          this.message = this.isEditMode ? 'Banner updated successfully!' : 'Banner saved successfully!';
          this.isSaving = false;
          setTimeout(() => {
            this.message = '';
            this.router.navigate(['/admin/banner-list']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('Error saving banner', err);
          this.message = 'Failed to save banner.';
          this.isSaving = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    };

    if (this.selectedFile) {
      this.isUploading = true;
      this.apiService.uploadImage(this.selectedFile, 'banners').subscribe({
        next: (res) => {
          this.bannerData.image_url = res.url;
          this.selectedFile = null;
          this.isUploading = false;
          doSave();
        },
        error: (err) => {
          console.error('Image upload failed', err);
          this.message = 'Image upload to Cloudinary failed.';
          this.isSaving = false;
          this.isUploading = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    } else {
      doSave();
    }
  }

  resetForm() {
    this.bannerData = { tagline: '', heading: '', description: '', image_url: '' };
    this.selectedImage = null;
    this.selectedFile = null;
  }
}
