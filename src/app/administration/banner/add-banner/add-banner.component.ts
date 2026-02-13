import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-banner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.css']
})
export class AddBannerComponent {
  selectedImage: string | ArrayBuffer | null = null;
  bannerData = {
    tagline: '',
    heading: '',
    description: '',
    image: null as File | null
  };

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.bannerData.image = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveBanner() {
    // Placeholder for save functionality
    console.log('Saving banner:', this.bannerData);

    // Validation
    if (!this.bannerData.heading || !this.bannerData.description || !this.bannerData.image) {
      alert('Please fill in all required fields and upload an image');
      return;
    }

    // Here you would typically send data to backend
    alert('Banner saved successfully! (This is a placeholder)');

    // Reset form
    this.resetForm();
  }

  resetForm() {
    this.bannerData = {
      tagline: '',
      heading: '',
      description: '',
      image: null
    };
    this.selectedImage = null;
  }
}
