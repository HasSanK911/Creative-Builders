import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-about-company-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-about-company-details.component.html',
  styleUrls: ['./add-about-company-details.component.css']
})
export class AddAboutCompanyDetailsComponent {
  selectedImage: string | ArrayBuffer | null = null;

  companyData = {
    sectionLabel: '',
    mainHeading: '',
    mainDescription: '',
    feature1: '',
    feature2: '',
    feature3: '',
    foundationDescription: '',
    image: null as File | null
  };

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.companyData.image = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveCompanyDetails() {
    console.log('Saving company details:', this.companyData);

    // Validation
    if (!this.companyData.mainHeading || !this.companyData.mainDescription) {
      alert('Please fill in all required fields');
      return;
    }

    alert('Company details saved successfully! (This is a placeholder)');
    this.resetForm();
  }

  resetForm() {
    this.companyData = {
      sectionLabel: '',
      mainHeading: '',
      mainDescription: '',
      feature1: '',
      feature2: '',
      feature3: '',
      foundationDescription: '',
      image: null
    };
    this.selectedImage = null;
  }
}
