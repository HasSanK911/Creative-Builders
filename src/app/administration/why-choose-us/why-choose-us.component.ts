import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-add-why-choose-us',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './why-choose-us.component.html',
  styleUrl: './why-choose-us.component.css'
})
export class AddWhyChooseUsComponent implements OnInit {

  data: any = {
    section_label: '', heading: '', description: '', image_url: '',
    features: []
  };
  isLoading = false;
  isSaving = false;
  isUploading = false;
  message = '';
  private imageFile: File | null = null;

  constructor(private apiService: ApiService<any>) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.apiService.getById('admin/why-choose-us').subscribe({
      next: (res: any) => {
        // If we have any meaningful data, load it
        if (res.heading || (res.features && res.features.length > 0) || res.section_label) {
          this.data = {
            section_label: res.section_label || '',
            heading: res.heading || '',
            description: res.description || '',
            image_url: res.image_url || '',
            features: Array.isArray(res.features) ? res.features : []
          };

          // Ensure at least one feature row if empty
          if (this.data.features.length === 0) {
            this.addFeature();
          }
        } else {
          // Initialize fresh for new user
          this.data = {
            section_label: '',
            heading: '',
            description: '',
            image_url: '',
            features: [
              { title: '', description: '' },
              { title: '', description: '' },
              { title: '', description: '' }
            ]
          };
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading Why Choose Us:', err);
        this.isLoading = false;
        // Fallback initialization
        if (!this.data.features || this.data.features.length === 0) {
          this.data.features = [{ title: '', description: '' }];
        }
      }
    });
  }

  addFeature() {
    this.data.features.push({ title: '', description: '' });
  }

  removeFeature(index: number) {
    this.data.features.splice(index, 1);
  }

  onUploadClick(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: any, previewImage: HTMLImageElement, placeholderText: HTMLElement) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (previewImage) {
          previewImage.src = e.target.result;
          previewImage.style.display = 'block';
        }
        if (placeholderText) placeholderText.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  }

  save() {
    if (this.isSaving || this.isUploading) return;

    this.isSaving = true;
    const doSave = () => {
      const payload = {
        section_label: this.data.section_label,
        heading: this.data.heading,
        description: this.data.description,
        image_url: this.data.image_url,
        features: this.data.features
      };
      this.apiService.create('admin/why-choose-us', payload).subscribe({
        next: () => {
          this.message = 'Why Choose Us saved successfully!';
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
      this.apiService.uploadImage(this.imageFile, 'why-choose-us').subscribe({
        next: (res: any) => {
          this.data.image_url = res.url;
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
}
