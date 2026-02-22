import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-add-about-company-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-about-company-details.component.html',
  styleUrls: ['./add-about-company-details.component.css']
})
export class AddAboutCompanyDetailsComponent implements OnInit {
  selectedImage: string | ArrayBuffer | null = null;
  isLoading = false;
  isSaving = false;
  isUploading = false;
  message = '';
  private imageFile: File | null = null;

  companyData: any = {
    section_label: '',
    heading: '',
    description: '',
    feature1: '',
    feature2: '',
    feature3: '',
    foundation_description: '',
    image_url: ''
  };

  constructor(private apiService: ApiService<any>) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.apiService.getById('admin/about-company').subscribe({
      next: (res: any) => {
        if (res?.heading) {
          this.companyData = { ...res };
          if (res.image_url) this.selectedImage = res.image_url;
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => { this.selectedImage = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  saveCompanyDetails() {
    if (!this.companyData.heading || !this.companyData.description) {
      this.message = 'Please fill in all required fields.';
      setTimeout(() => this.message = '', 3000);
      return;
    }
    this.isSaving = true;

    const doSave = () => {
      this.apiService.create('admin/about-company', this.companyData).subscribe({
        next: () => {
          this.message = 'About Company details saved!';
          this.imageFile = null;
          this.isSaving = false;
          setTimeout(() => this.message = '', 3000);
        },
        error: (err: any) => {
          console.error(err);
          this.message = 'Failed to save.';
          this.isSaving = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    };

    if (this.imageFile) {
      this.isUploading = true;
      this.apiService.uploadImage(this.imageFile, 'about-company').subscribe({
        next: (res) => { this.companyData.image_url = res.url; this.imageFile = null; this.isUploading = false; doSave(); },
        error: () => { this.message = 'Image upload failed.'; this.isSaving = false; this.isUploading = false; setTimeout(() => this.message = '', 3000); }
      });
    } else { doSave(); }
  }

  resetForm() {
    this.companyData = { section_label: '', heading: '', description: '', feature1: '', feature2: '', feature3: '', foundation_description: '', image_url: '' };
    this.selectedImage = null;
    this.imageFile = null;
  }
}
