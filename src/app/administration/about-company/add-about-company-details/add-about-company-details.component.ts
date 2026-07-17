import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { AboutCompany } from '../../../models/api.models';

@Component({
  selector: 'app-add-about-company-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-about-company-details.component.html',
  styleUrls: ['./add-about-company-details.component.css']
})
export class AddAboutCompanyDetailsComponent implements OnInit {
  private readonly endpoint = 'about-company';

  /** The stored absolute URL, or a data URL while a freshly picked file waits to be uploaded. */
  selectedImage: string | null = null;
  private imageFile: File | null = null;

  companyData: AboutCompany = this.blank();

  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private api: ApiService<AboutCompany>) { }

  ngOnInit(): void {
    this.load();
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.selectedImage = reader.result as string);
    reader.readAsDataURL(file);
  }

  saveCompanyDetails(): void {
    this.error = null;
    this.success = null;

    if (!this.companyData.mainHeading || !this.companyData.mainDescription) {
      this.error = 'Main Heading and Main Description are required.';
      return;
    }

    this.saving = true;

    // A newly picked file has to be stored first — the row carries the returned path, not the file.
    if (this.imageFile) {
      this.api.upload(this.imageFile).subscribe({
        next: uploaded => this.put(uploaded.path),
        error: err => this.fail(err),
      });
    } else {
      this.put(this.companyData.image);
    }
  }

  /** Discards unsaved edits by re-reading the stored row. */
  resetForm(): void {
    this.imageFile = null;
    this.error = null;
    this.success = null;
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.error = null;

    this.api.getById(this.endpoint).subscribe({
      next: row => {
        this.apply(row);
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  private put(image: string | null): void {
    this.api.update(this.endpoint, { ...this.companyData, image }).subscribe({
      next: row => {
        this.apply(row);
        this.saving = false;
        this.success = 'Company details saved successfully.';
      },
      error: err => this.fail(err),
    });
  }

  private apply(row: AboutCompany): void {
    this.companyData = { ...this.blank(), ...row };
    this.selectedImage = this.companyData.image;
    this.imageFile = null;
  }

  private fail(err: Error): void {
    this.error = err.message;
    this.saving = false;
  }

  private blank(): AboutCompany {
    return {
      image: null,
      sectionLabel: '',
      mainHeading: '',
      mainDescription: '',
      feature1: '',
      feature2: '',
      feature3: '',
      foundationDescription: '',
    };
  }
}
