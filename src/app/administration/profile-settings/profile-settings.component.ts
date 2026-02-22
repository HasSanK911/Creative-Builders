import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent implements OnInit, AfterViewInit {
  company: any = {
    company_name: '',
    phone: '',
    email: '',
    logo: ''
  };
  isLoading: boolean = false;
  isUploading: boolean = false;
  message: string = '';
  /** Holds the selected File object before upload */
  private selectedLogoFile: File | null = null;

  constructor(private el: ElementRef, private apiService: ApiService<any>) { }

  ngOnInit(): void {
    this.getCompany();
  }

  getCompany() {
    this.isLoading = true;
    this.apiService.getCompany().subscribe({
      next: (res: any) => {
        this.company = res;
        this.isLoading = false;
        if (this.company.logo) {
          const previewImage = this.el.nativeElement.querySelector('#previewImage');
          if (previewImage) {
            previewImage.src = this.company.logo;
          }
        }
      },
      error: (err: any) => {
        console.error('Error fetching company info', err);
        this.isLoading = false;
      }
    });
  }

  updateCompany() {
    this.isLoading = true;

    const doSave = () => {
      this.apiService.updateCompany(this.company).subscribe({
        next: () => {
          this.message = 'Company information updated successfully!';
          this.isLoading = false;
          setTimeout(() => this.message = '', 3000);
        },
        error: (err: any) => {
          console.error('Error updating company info', err);
          this.message = 'Failed to update company information.';
          this.isLoading = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    };

    // If a new logo file was selected, upload to Cloudinary first
    if (this.selectedLogoFile) {
      this.isUploading = true;
      this.apiService.uploadImage(this.selectedLogoFile, 'company').subscribe({
        next: (res) => {
          this.company.logo = res.url;
          this.selectedLogoFile = null;
          this.isUploading = false;
          doSave();
        },
        error: (err) => {
          console.error('Logo upload failed', err);
          this.message = 'Logo upload failed. Please try again.';
          this.isLoading = false;
          this.isUploading = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    } else {
      doSave();
    }
  }

  ngAfterViewInit(): void {
    this.initLogoUpload();
  }

  private initLogoUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#uploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#fileInput');
    const previewImage = this.el.nativeElement.querySelector('#previewImage');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        fileInput.click();
      });

      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          this.selectedLogoFile = file;
          // Show local preview immediately for good UX
          const reader = new FileReader();
          reader.onload = (e: any) => {
            if (previewImage) {
              previewImage.src = e.target.result;
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
}
